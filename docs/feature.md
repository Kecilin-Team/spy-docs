# Superpygeon Features Documentation

This document provides detailed information about all available features in Superpygeon, including their functionality, parameters, and usage examples.

## Table of Contents

1. [Attendance](#attendance)
2. [DwellTime](#dwelltime)
3. [LineCross](#linecross)
4. [Meeting](#meeting)
5. [ObjectViolation](#objectviolation)
6. [OverTime](#overtime)
7. [RegionCount](#regioncount)
8. [RegionCrowd](#regioncrowd)

---

## Attendance

### Purpose
Monitors region occupancy during specified time intervals and generates attendance reports at the end of each monitoring period.

### How it Works
- Tracks whether designated regions are occupied by objects during a defined time period
- Calculates occupancy duration and percentage for each region
- Generates attendance reports when the monitoring period ends
- Resets tracking daily and prevents duplicate reports

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `regions` | `List[Region]` | Required | List of Region objects for attendance monitoring. Only regions with 'attendance' in mode will be processed |
| `timer` | `Timer` | Required | Timer object for tracking time and durations |
| `start_time` | `str` | Required | Start time in "HH:MM:SS" format (e.g., "09:00:00") |
| `end_time` | `str` | Required | End time in "HH:MM:SS" format (e.g., "17:00:00") |
| `timezone` | `pytz.timezone` | `pytz.timezone("Etc/GMT-7")` | Timezone for time calculations |

### Return Values
Returns a list of dictionaries containing:
- `region_id`: ID of the monitored region
- `duration`: Total occupancy duration in seconds
- `percentage`: Occupancy percentage of the monitoring period
- `start_time`: Monitoring start time
- `end_time`: Monitoring end time
- `region_type`: Type of region (if specified in region attributes)

---

## DwellTime

### Purpose
Tracks how long objects stay in regions and reports when they exit after exceeding a minimum threshold.

### How it Works
- Uses RegionTimeTracker to monitor object entry/exit events
- Tracks duration each object spends in regions
- Reports exit events only when duration exceeds the consistency threshold
- Can capture and annotate exit frames

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `regions` | `List[Region]` | Required | List of Region objects for dwelltime monitoring. Only regions with 'dwelltime' in mode will be processed |
| `timer` | `Timer` | Required | Timer object for tracking time |
| `tracker` | `RegionTimeTracker` | Required | Tracker object for monitoring objects in regions |
| `consistency_threshold` | `int` | `15` | Minimum dwell time in seconds to report |

### Return Values
Returns a list of dictionaries containing:
- `object_id`: ID of the object that exited
- `region_id`: ID of the region
- `duration`: Time spent in region (seconds)
- `cls`: Object class name
- `entry_time`: Timestamp when object entered (if available)
- `exit_time`: Timestamp when object exited (if available)
- `region_type`: Type of region (if specified)
- `image`: Annotated exit frame (if available)

---

## LineCross

### Purpose
Detects when objects cross defined lines and tracks crossing directions.

### How it Works
- Uses LineCrossingTracker to monitor object movements
- Detects when object centroids cross line boundaries
- Supports different line types (upwards, downwards, bidirectional)
- Can reset counters daily and handle recounting

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `lines` | `Optional[List]` | `None` | List of Line objects (LineUpwards, LineDownwards, or LineBidirectional) |
| `centroid` | `str` | `"mid_centre"` | Centroid position for crossing detection. Options: 'mid_centre', 'mid_left', 'mid_right', 'top_centre', 'top_left', 'top_right', 'bottom_centre', 'bottom_left', 'bottom_right' |
| `lost_threshold` | `int` | `30` | Number of frames to wait before considering an object as lost |
| `allow_recounting` | `bool` | `True` | Whether to reset counters daily at midnight |

### Return Values
Returns a dictionary containing line crossing events and current counts.

---

## Meeting

### Purpose
Monitors meetings based on participant count in regions, tracking start/end times and participant statistics.

### How it Works
- Tracks participant count in designated regions
- Identifies potential meetings when count exceeds minimum threshold
- Confirms meetings after sustained participant presence
- Monitors meeting end when participant count drops
- Can track specific participant counts for detailed timing

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `regions` | `List[Region]` | Required | List of Region objects to monitor for meetings |
| `timer` | `Timer` | Required | Timer object to track meeting durations |
| `consistency_threshold` | `int` | `1` | Duration (seconds) for meeting condition stability |
| `negative_consistency_threshold` | `int` | `1` | Duration (seconds) for meeting end condition stability |
| `potential_reset_threshold` | `int` | `10` | Threshold for potential reset of meeting state |
| `min_participants` | `int` | `2` | Minimum participants required for valid meeting |
| `end_participants` | `int` | `1` | Participant count to trigger meeting end |
| `meeting_start_threshold` | `int` | `60` | Time threshold to confirm meeting start |
| `num_participants_timed` | `Optional[int]` | `None` | Specific participant count to time separately |
| `timezone` | `pytz.timezone` | `pytz.timezone("Etc/GMT-7")` | Timezone for timestamps |

### Return Values
Returns a list of dictionaries containing:
- `region_id`: ID of the meeting region
- `meeting_id`: Unique meeting identifier
- `duration`: Meeting duration in seconds
- `max_participants`: Maximum participant count during meeting
- `status`: "meeting_started" or "meeting_ended"
- `specific_participants_duration`: Duration with specific participant count (if configured)
- `type`: Region type (if specified)

---

## ObjectViolation

### Purpose
Detects violations based on spatial relationships between objects, checking for mandatory objects or forbidden objects within base object boundaries.

### How it Works
- Identifies base objects in regions
- Checks for mandatory objects that must be present within base object's bounding box
- Checks for violation objects that must not be present within base object's bounding box
- Uses IoU (Intersection over Union) to determine spatial associations
- Uses duration-based alerting to prevent false positives

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `regions` | `List[Region]` | Required | List of Region objects to monitor. Only regions with 'objectviolation' in mode will be processed |
| `timer` | `Timer` | Required | Timer object for tracking violation durations |
| `base_object` | `str` | Required | Class name of primary object being evaluated (e.g., 'person') |
| `mandatory_objects` | `Optional[List[str]]` | `None` | List of object classes that must be present within base object's bbox |
| `violation_objects` | `Optional[List[str]]` | `None` | List of object classes that must not be present within base object's bbox |
| `iou_threshold` | `float` | `0.5` | IoU threshold for determining spatial association between objects |
| `consistency_threshold` | `int` | `5` | Duration (seconds) a violation must persist before confirmation |
| `negative_consistency_threshold` | `int` | `5` | Duration (seconds) without violation needed to resolve alert |

### Return Values
Returns a list of dictionaries containing:
- `region_id`: ID of the region
- `object_id`: ID of the base object
- `region_type`: Type of region (if specified)
- Boolean flags for each mandatory/violation object presence

---

## OverTime

### Purpose
Detects when objects stay in regions longer than allowed thresholds and generates overtime alerts.

### How it Works
- Uses RegionTimeTracker to monitor object presence duration
- Triggers alerts when objects exceed the configured time threshold
- Can send repeated alerts at specified intervals
- Tracks which objects are currently in overtime status

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `regions` | `List[Region]` | Required | List of Region objects to monitor for overtime. Only regions with 'overtime' in mode will be processed |
| `timer` | `Timer` | Required | Timer object for tracking time |
| `tracker` | `RegionTimeTracker` | Required | Tracker object for monitoring objects in regions |
| `alert_threshold` | `int` | `300` | Time threshold in seconds before triggering overtime alert |
| `repeat_interval` | `Optional[int]` | `None` | Interval in seconds for repeating overtime alerts |

### Return Values
Returns a list of dictionaries containing:
- `object_id`: ID of the object in overtime
- `region_id`: ID of the region
- `duration`: Time spent in region (seconds)
- `cls`: Object class name
- `region_type`: Type of region (if specified)

---

## RegionCount

### Purpose
Counts the number of objects of a specific class in designated regions.

### How it Works
- Filters objects by specified class name
- Counts objects currently present in each region
- Only processes regions with 'regioncount' in their mode
- Provides real-time object counts

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `regions` | `List[Region]` | Required | List of Region objects to monitor for counting. Only regions with 'regioncount' in mode will be processed |
| `cls` | `str` | `None` | Class name to filter objects for counting (e.g., 'person', 'vehicle'). If None, no processing occurs |

### Return Values
Returns a list of dictionaries containing:
- `region_id`: ID of the region
- `count`: Number of objects of specified class
- `cls`: Object class name that was counted
- `region_type`: Type of region (if specified)

---

## RegionCrowd

### Purpose
Detects crowd violations in regions based on object count thresholds (minimum, maximum, or expected counts).

### How it Works
- Counts objects of specified class in each region
- Compares counts against configured thresholds (min, max, or expected)
- Uses duration-based alerting to prevent false positives
- Can send violation start and resolution notifications
- Tracks violation durations and generates unique event IDs

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `regions` | `List[Region]` | Required | List of Region objects to monitor. Only regions with 'regioncrowd' in mode will be processed |
| `timer` | `Timer` | Required | Timer object for tracking violation durations |
| `min_count` | `int` | `None` | Minimum allowed object count. Violation when count < min_count. Cannot be used with expected_count |
| `expected_count` | `int` | `None` | Expected exact object count. Violation when count != expected_count. Cannot be used with min_count/max_count |
| `max_count` | `int` | `None` | Maximum allowed object count. Violation when count > max_count. Cannot be used with expected_count |
| `consistency_threshold` | `int` | `5` | Frames a violation must persist before confirmation |
| `negative_consistency_threshold` | `int` | `5` | Frames without violation needed to resolve alert |
| `send_resolved` | `bool` | `False` | Whether to send resolution notifications when violations are cleared |
| `cls` | `str` | `None` | Class name to filter objects for counting. If None, no processing occurs |

### Return Values
Returns a list of dictionaries containing:

**For violations:**
- `region_id`: ID of the region
- `cls`: Object class that was counted
- `count`: Current number of objects causing violation
- `expected_count`/`min_count`/`max_count`: Configured thresholds
- `status`: True (indicating active violation)
- `event_id`: Unique event identifier (if send_resolved=True)
- `region_type`: Type of region (if specified)

**For resolutions (if send_resolved=True):**
- `region_id`: ID of the region
- `count`: Current non-violating object count
- `duration`: Total violation duration in seconds
- `status`: False (indicating resolution)
- `event_id`: Matching event identifier
- `region_type`: Type of region (if specified)

---

## Common Concepts

### Region Modes
Each feature operates on regions with specific modes:
- `attendance`: For attendance monitoring
- `dwelltime`: For dwell time tracking
- `meeting`: For meeting detection
- `objectviolation`: For object violation detection
- `overtime`: For overtime monitoring
- `regioncount`: For object counting
- `regioncrowd`: For crowd violation detection

### Duration-Based Alerting
Many features use duration-based alerting to prevent false positives:
- `consistency_threshold`: How long a condition must persist before triggering
- `negative_consistency_threshold`: How long the absence of a condition must persist before resolving

### Timezone Handling
Features that work with time periods support timezone configuration for accurate local time calculations.

### Return Data Structure
Most features return lists of dictionaries containing event data, with common fields:
- `region_id`: Identifier of the region where the event occurred
- `region_type`: Type of region (if specified in region attributes)
- Various feature-specific data fields
