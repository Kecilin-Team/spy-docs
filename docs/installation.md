# Superpygeon Installation Guide

This guide provides step-by-step instructions for installing and running Superpygeon using Docker.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation Steps](#installation-steps)
3. [Running Superpygeon](#running-superpygeon)
4. [Verification](#verification)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before installing Superpygeon, ensure you have the following installed on your system:

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)
- **Web Browser** (for accessing the config builder)

### Installing Docker

Please refer to the official Docker installation guide: https://docs.docker.com/engine/install/

---

## Installation Steps

### Step 1: Download Superpygeon Resources

Download all required resources from the following SharePoint link:
[Superpygeon Resources](https://assistxenterprise.sharepoint.com/:f:/s/DataBadrut/ElRr79PAbMFPsumpdLqceA4B9aWurOupZtgZFBgIeZA9IQ?e=t3095d)

Download the following files/folders:

- `./config` (folder)
- `./docker-compose.yml`
- `./compose.builder.yaml`

Extract and organize them in your desired directory:

```bash
# Create a new directory for Superpygeon
mkdir superpygeon
cd superpygeon

# Extract downloaded files here, ensuring the structure:
# superpygeon/
# ├── config/
# ├── docker-compose.yml
# └── compose.builder.yaml
```

### Step 2: Setup Configuration Builder

For setting up the configuration builder, please refer to the [Config Builder Guide](config-builder.md)

### Step 3: Create Configuration Files

1. Follow the config builder setup guide to access the configuration interface
2. Use the visual interface to:
   - Configure camera/video sources
   - Set up detection regions
   - Define line crossing areas
   - Configure features (attendance, dwell time, etc.)
   - Set alert parameters

3. Download or save the generated configuration files

### Step 4: Place Configuration Files

Place your generated configuration files to the `config/app/` directory.

**Important Notes:**

- Each configuration file should have a unique `cctv_id` in the metadata section
- Multiple configuration files can be placed in `config/app/` for multiple cameras
- Configuration files must have `.yaml` extension

---

## Running Superpygeon

### Step 1: Authenticate with Docker Registry

Before starting the services, you need to authenticate with the AssistX Docker registry:

```bash
# Login to the AssistX Docker registry
docker login registry.assistx.dev
```

When prompted, enter your credentials:
- **Username**: Contact the AI team for your username
- **Password**: Contact the AI team for your password

**Note**: If you don't have registry credentials, please contact the AI team to obtain your username and password for `registry.assistx.dev`.

### Step 2: Start Services with Docker Compose

```bash
# Start all services
docker-compose up -d
```

This command will start the following services:

- **Redis**: Message broker for communication between components
- **MediaMTX**: RTSP/WebRTC streaming server
- **Model Downloader**: Downloads required AI models
- **Model Server**: Serves AI models for inference
- **Feeder**: Processes video input and feeds frames to Redis
- **App Superpygeon**: Main application processing pipeline

### Step 3: Monitor Service Status

```bash
# Check status of all services
docker-compose ps

# View logs from all services
docker-compose logs -f

# View logs from specific service
docker-compose logs -f app-superpygeon
```

### Step 4: Access the Application

Once all services are running:

- **RTSP Stream**: `rtsp://localhost:6554/<config_file_name>`
- **WebRTC Stream**: `http://localhost:7902/<config_file_name>`

---

## Verification

### Check Service Health

```bash
# Verify all containers are running
docker-compose ps

# Expected output should show all services as "Up"
#     Name                   Command               State           Ports
# redis                redis-server ...             Up      0.0.0.0:6379->6379/tcp
# mediamtx             /mediamtx                    Up      0.0.0.0:6554->6554/tcp, 0.0.0.0:7902->7902/tcp
# model-server         /ovms/bin/ovms --config_...  Up      0.0.0.0:6565->6565/tcp
# feeder               /app/.venv/bin/python ...    Up
# app-superpygeon      /app/.venv/bin/python ...    Up
```

### Test Video Processing

```bash
# Check feeder logs for video processing
docker-compose logs feeder

# Check main application logs
docker-compose logs app-superpygeon

# Look for messages like:
# "Processing frame from camera: test"
# "Feature detection completed"
```

### Test Streaming Output

```bash
# Test RTSP stream using ffplay (if available)
ffplay rtsp://localhost:6554/<config_file_name>

# Or use VLC media player:
# File -> Open Network Stream -> rtsp://localhost:6554/live/stream
```

---

## Configuration Management

### Adding New Cameras

1. Create a new configuration file using the config builder
2. Ensure the `cctv_id` is unique
3. Place the file in `config/app/`
4. Restart the services:

```bash
docker-compose restart feeder app-superpygeon
```

### Updating Existing Configuration

1. Modify the configuration file in `config/app/`
2. Restart the specific services:

```bash
docker-compose restart feeder app-superpygeon
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Services Not Starting

```bash
# Check Docker status
sudo systemctl status docker

# Restart Docker if needed
sudo systemctl restart docker

# Check available disk space
df -h

# Check available memory
free -h
```

#### 2. Model Download Issues

```bash
# Check model downloader logs
docker-compose logs model-downloader

# Manually restart model downloader
docker-compose restart model-downloader

# Check if models directory has content
ls -la models/
```

#### 3. Video Input Issues

```bash
# Check feeder logs for input errors
docker-compose logs feeder

# Test video source manually (if using file/URL)
ffplay your_video_source

# For webcam issues, ensure device permissions
ls -la /dev/video*
```

#### 4. Redis Connection Issues

```bash
# Check Redis status
docker-compose logs redis

# Test Redis connection
docker exec -it redis redis-cli ping
# Expected output: PONG
```

#### 5. Memory Issues

```bash
# Check memory usage of containers
docker stats

# If running out of memory, consider:
# - Reducing max_fps in configuration
# - Reducing resize_factor
# - Limiting number of concurrent cameras
```

### Logs and Debugging

```bash
# View all logs
docker-compose logs

# View logs with timestamps
docker-compose logs -t

# Follow logs in real-time
docker-compose logs -f

# View logs for specific service
docker-compose logs -f app-superpygeon

# Save logs to file
docker-compose logs > superpygeon-logs.txt
```

### Performance Optimization

#### For Low-Resource Systems

```yaml
# In your config file, adjust:
input:
  max_fps: 5          # Reduce from 15
  resize_factor: 0.5  # Reduce frame size
  max_queue: 1        # Reduce queue size

model:
  device: cpu         # Use CPU instead of GPU
  conf: 0.7          # Higher confidence threshold
```

#### For High-Performance Systems

```yaml
# In your config file, adjust:
input:
  max_fps: 30         # Increase fps
  resize_factor: 1    # Full resolution
  max_queue: 5        # Larger queue

model:
  device: gpu         # Use GPU if available
  conf: 0.3          # Lower confidence threshold
```

---

## Stopping Superpygeon

### Graceful Shutdown

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (caution: removes data)
docker-compose down -v

# Stop and remove images
docker-compose down --rmi all
```

### Emergency Stop

```bash
# Force stop all containers
docker stop $(docker ps -q)

# Remove all containers
docker rm $(docker ps -aq)
```

---

## Next Steps

After successful installation:

1. **Configure Features**: Set up your camera configurations using the [Config Builder Guide](config-builder.md)
2. **Set Up Monitoring**: Configure logging and monitoring for production use
3. **Scale Deployment**: Add more cameras and configure load balancing if needed
4. **Integration**: Integrate with your existing systems using the API endpoints

For additional help, please refer to:
- [Config Builder Guide](config-builder.md)
- [GitHub Issues](https://github.com/Kecilin-Team/superpygeon/issues)