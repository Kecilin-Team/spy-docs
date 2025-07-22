# Superpygeon Configuration Builder Guide

This guide provides instructions for setting up and using the Superpygeon Configuration Builder to create camera configuration files.

## Table of Contents

1. [Overview](#overview)
2. [Setup](#setup)
3. [Starting the Config Builder](#starting-the-config-builder)
4. [Drawing Tools](#drawing-tools)
5. [Exporting Configuration](#exporting-configuration)
6. [Troubleshooting](#troubleshooting)

---

## Overview

The Superpygeon Configuration Builder is a web-based visual interface that allows you to create YAML configuration files for the Superpygeon system. This tool provides an intuitive interface for configuring models, features, input/output settings, and drawing detection regions and lines.

### Key Features

- **🎯 Model Configuration**: Configure detection models, device settings, and parameters
- **🔧 Feature Management**: Enable/disable features with automatic null value handling
- **📊 Input/Output Configuration**: Support for multiple input sources and formats
- **🎨 Visual Drawing Tools**: Interactive line and region drawing with coordinate normalization
- **🖥️ Responsive Interface**: Modern, mobile-friendly design with keyboard shortcuts

---

## Setup

### Prerequisites

Ensure you have the required `compose.builder.yaml` file. If you don't have it, download it from [Superpygeon Resources](https://assistxenterprise.sharepoint.com/:f:/s/DataBadrut/ElRr79PAbMFPsumpdLqceA4B9aWurOupZtgZFBgIeZA9IQ?e=t3095d).

### Starting the Config Builder

1. Navigate to your Superpygeon resource directory

2. Start the configuration builder using Docker Compose:
```bash
docker-compose -f compose.builder.yaml up -d
```

3. Access the configuration builder in your web browser:
```
http://localhost:8000
```

**Note**: The API backend runs on port 6996, while the web interface is accessible on port 8000.

---

## Drawing Tools

### Line Drawing Interface

Access via "Draw Lines" button or `http://localhost:8000/drawLine.html`

**Drawing Process**:
1. **Load Image/Video**: Upload or specify source for drawing reference
2. **Draw Lines**: Click two points to define a detection line
3. **Set Direction**: Click a third point to specify detection direction
4. **Configure Properties**: Set line type and bidirectional options

**Keyboard Shortcuts**:
- `Q`: Finish and save all lines
- `C`: Clear all lines
- `D`: Delete last line
- `B`: Toggle bidirectional mode
- `1`: Set unidirectional mode
- `2`: Set bidirectional mode

**Line Properties**:

- **Direction**: Configurable detection direction
- **Type**: Different line types for various detection scenarios
- **Bidirectional**: Support for two-way detection

### Region Drawing Interface

Access via "Draw Regions" button or `http://localhost:8000/drawRegion.html`

**Drawing Process**:

1. **Load Image/Video**: Upload or specify source for drawing reference
2. **Draw Polygon**: Click multiple points to define region boundaries
3. **Complete Region**: Press `N` or click "New Region" to finish current polygon
4. **Configure Detection**: Set detection modes for each region

**Keyboard Shortcuts**:
- `Q`: Finish and save all regions
- `C`: Clear all regions
- `D`: Delete last point or region
- `N`: Start new region
- `R`: Randomize region color
- `1`-`9`: Toggle different detection modes

**Region Properties**:

- **Detection Modes**: Multiple detection types per region
- **Color Coding**: Visual differentiation with customizable colors
- **Coordinate Precision**: 6-decimal place accuracy

---

## Exporting Configuration

### Generate Configuration File

1. **Complete All Sections**:
   - Configure model parameters
   - Enable required features
   - Set input/output specifications
   - Draw necessary lines and regions

2. **Generate YAML**:
   - Click "Generate Config" in the main interface
   - Review the generated YAML configuration
   - Validate all settings are correct

3. **Export Options**:
   - Copy YAML to clipboard
   - Download as `.yaml` file
   - Save for later editing

### Configuration File Structure

Generated configuration follows this structure:

```yaml
model:
  name: person
  device: cpu
  conf: 0.5
  iou: 0.5
  type: small
  classes:
    - person
feature:
  - linecross
feature_params:
  linecross:
    send_crop: false
lines: 
  - bidirectional: true
    color: '#5fc785'
    coords:
      - x: 0
        'y': 0.519444
      - x: 0.919271
        'y': 0.537037
    id: 1
    direction: downward
    orientation: vertical
regions: []
input:
  video_source: 0
  resize_factor: 1
  max_fps: 15
  max_queue: 2
output:
  url_dashboard: 0.0.0.0
  save_video: false
metadata:
  cctv_id: test
```

---

## Advanced Features

### Multiple Camera Setup

1. **Create Separate Configurations**: Generate individual YAML files for each camera
2. **Unique Identifiers**: Ensure each configuration has a unique `cctv_id`
3. **Consistent Naming**: Use descriptive names and locations
4. **Resource Planning**: Consider processing capacity for multiple streams

### Performance Optimization

**Model Configuration**:

- Use GPU device for better performance when available
- Adjust confidence thresholds based on accuracy requirements
- Select specific object classes to reduce processing overhead

**Input Settings**:

- Optimize `max_fps` based on detection requirements
- Configure `max_queue` for smooth processing
- Use appropriate input resolution

---

## Troubleshooting

### Common Issues

#### 1. Config Builder Not Loading

```bash
# Check container status
docker-compose -f compose.builder.yaml ps

# View service logs
docker-compose -f compose.builder.yaml logs

# Restart services
docker-compose -f compose.builder.yaml restart
```

#### 2. Cannot Access Web Interface

- **Port 8000 blocked**: Check firewall settings
- **Port conflict**: Verify no other service uses port 8000
- **Network issues**: Try `http://127.0.0.1:8000`

#### 3. Canvas/Drawing Issues

- **Browser compatibility**: Ensure Canvas API support
- **Image not loading**: Verify image source is accessible
- **Coordinates not saving**: Load image before drawing

#### 4. API Connection Failed

```bash
# Check API service
curl http://localhost:6996/health

# View API logs
docker-compose -f compose.builder.yaml logs app

# Restart API service
docker-compose -f compose.builder.yaml restart app
```

#### 5. Configuration Export Issues

- **Invalid YAML**: Check all required fields are completed
- **Coordinate errors**: Ensure regions and lines are properly drawn
- **Feature conflicts**: Verify enabled features have required parameters

### Debug Mode

Enable debug mode for troubleshooting:

```bash
# Set environment variables
export DEBUG=true
export LOG_LEVEL=debug

# Restart with debug enabled
docker-compose -f compose.builder.yaml up -d
```

---

## Stopping the Config Builder

When finished configuring:

```bash
# Stop the config builder
docker-compose -f compose.builder.yaml down

# Remove containers and volumes
docker-compose -f compose.builder.yaml down -v
```

---

## Next Steps

After creating configuration files:

1. **Place Files**: Copy generated YAML files to `config/app/` directory
2. **Validate**: Test configuration with Superpygeon
3. **Deploy**: Follow the [Installation Guide](installation.md) to run Superpygeon
4. **Monitor**: Check performance and adjust parameters as needed

For additional help:

- [Installation Guide](installation.md)
- [Feature Documentation](feature.md)
