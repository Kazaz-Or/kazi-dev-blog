---
title: "Easy Minimal CLI Using Appeal Library"
description: In continuation to my previous post, I'll show you how to create a minimal and compatible CLI using the Appeal library.
author: Or Kazaz
authorImage: https://avatars.githubusercontent.com/u/83350680?v=4
coverImage: https://res.cloudinary.com/practicaldev/image/fetch/s--Aj0NNAUm--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/90bvqpuit9ty65lu3rzx.jpg
date: "2023-12-18"
tags: ["Python"]
---

In continuation to my [previous post](./hosted-machines-monitoring), I took the OpenTelemetry Collector Contrib project and wrapped it in a minimal CLI using the [Appeal library](https://github.com/larryhastings/appeal/). This CLI is also compatible for all the common OS's (Windows, MacOS and Linux).

The goal was to make the OTEL binary a little bit more focused for our team use case, and easy for installation and usage.

## So What is Appeal?

Appeal is a command-line argument processing library for Python, like argparse, optparse, getopt, docopt, Typer, and click. But Appeal takes a refreshing new approach - the easiest approach I've seen so far. You're basically write Python functions, and Appeal translates them into command-line options and arguments.

Although its official documentation declares it wasn't tested on Windows yet, I found it to be working just fine (on Windows 10).


## My Use Case

I wanted to create a CLI that will be able to download the latest OTEL binary from the official GitHub repository, install it, run it, stop it and uninstall it without the user to worry about anything.
So in my use case at work I created the following commands: Download, Install, Run, Stop, Uninstall and Help is being generated for us automatically due to appeal's nature.

To start the CLI, I created `otel_cli` with a shebang so it'll be able to run as a script.
In addition to that i've added the imports used, initialization of the Appeal object and some global variables that will be used later.

```python
#!/usr/bin/env python3

import os
import shutil
import signal
import socket
import tarfile
import subprocess
import appeal
import ssl
import platform
import sys

from urllib.request import urlretrieve

app = appeal.Appeal()

ssl._create_default_https_context = ssl._create_unverified_context

CORALOGIX_DOMAIN = 'somedomain.coralogix.com'
CORALOGIX_APP_NAME = 'CI-Machine'
OTEL_PID = 'otelcol.pid'
_OTEL_CONTRIB_DIR = 'otel-contrib-dir'

#...commands...#

if __name__ == '__main__':
    app.main()

```

Now let's dig in into the commands themselves.

__download command__

```python
def get_machine_type():
    arch = platform.machine()
    if arch in ['AMD64', 'x86_64']:
        return "amd64"
    elif arch in ['arm64', 'aarch64']:
        return "arm64"
    else:
        print("Failed to detect architecture")
        raise ValueError(f"Unsupported architecture: {arch}")


def get_os_type():
    if platform.system() == 'Darwin':
        print("Detected MacOS")
        return "darwin"
    elif platform.system() == 'Linux':
        print("Detected Linux OS")
        return "linux"
    elif platform.system() == 'Windows':
        print("Detected Windows OS")
        return "windows"
    else:
        raise ValueError(f"Unsupported OS: {platform.system()}")

@app.command()
def download(version="0.89.0", ignore_cache=True):
    '''Download the OpenTelemetry Collector binary for the current machine.'''
    machine_type = get_machine_type()
    os_type = get_os_type()
    filename = f"otelcol-contrib_{version}_{os_type}_{machine_type}.tar.gz"
    url = f"https://github.com/open-telemetry/opentelemetry-collector-releases/releases/download/v{version}/{filename}"
    print(f"Downloading: {filename}...")
    if not os.path.exists(_OTEL_CONTRIB_DIR):
        os.mkdir(_OTEL_CONTRIB_DIR)
    urlretrieve(url, f'./{_OTEL_CONTRIB_DIR}/{filename}')
    print("Download completed.")

```

The `download` command is designed to fetch the OpenTelemetry Collector binary that matches the user's system architecture and operating system. This command leverages Python's built-in `platform` and `urllib` libraries to determine the system specifics and retrieve the necessary files.

`get_machine_type`: This function uses `platform.machine()` to identify the system's architecture. It supports both amd64 and arm64 architectures. If the architecture is not recognized, it raises a ValueError.

`get_os_type`: This function uses `platform.system()` to determine the operating system (Darwin for macOS, Linux, and Windows). Like `get_machine_type`, it raises a ValueError if the OS is not supported.

The download function first retrieves the machine type and OS type using the above functions. It constructs the filename for the binary to download, using the version number, OS type, and machine type.

The binary's URL is generated based on the filename. It checks if the directory `_OTEL_CONTRIB_DIR` exists and creates it if it doesn't. The binary is downloaded using `urlretrieve` and stored in `_OTEL_CONTRIB_DIR`. And eventually the function prints a message to indicate the completion of the download.


__install command__

```python
@app.command()
def install():
    '''Install the OpenTelemetry Collector binary for the current machine.'''
    files = [f for f in os.listdir(f'./{_OTEL_CONTRIB_DIR}') if f.endswith('.tar.gz')]
    if not files:
        raise FileNotFoundError("No tar.gz file found for installation.")
    tar_file = f'./{_OTEL_CONTRIB_DIR}/{files[0]}'
    print(tar_file)

    print(f"Installing {tar_file}...")
    with tarfile.open(tar_file, 'r:gz') as tar:
        tar.extractall(path=f'./{_OTEL_CONTRIB_DIR}')
    print("Installation completed. You can now run the application by running: otel_cli run")
```

The `install` command is responsible for setting up the OpenTelemetry Collector binary on the user's system. This command assumes that the binary has been downloaded using the download command and is present in a specific directory.

The function begins by searching for `.tar.gz` file within the `_OTEL_CONTRIB_DIR` directory. This is where the downloaded binary should be located. If no such file is found, it raises a FileNotFoundError.

Once the file is located, the script prints the path of the tar file, indicating the binary to be installed. Using Python's `tarfile` module, the script opens the .tar.gz file in read mode and extracts its contents to _OTEL_CONTRIB_DIR.

After successfully extracting the files, the script prints a message indicating that the installation is complete and that the user can now run the application.

The use of `tarfile.open` in the with statement ensures that the tar file is correctly opened and closed after the operation, following Python's recommended practice for file handling. The `extractall` method is used to extract all contents of the tar file into the specified directory. This approach abstracts the extraction process from the user, making the installation process straightforward and user-friendly.


__run command__

```python
@app.command()
def run(config_file="config.yaml"):
    '''Run the OpenTelemetry Collector binary for the current machine.'''
    binary_name = 'otelcol-contrib'
    if sys.platform == 'win32':
        binary_name += '.exe'

    otel_col_path = os.path.join(os.getcwd(), _OTEL_CONTRIB_DIR, binary_name)
    if not os.path.isfile(otel_col_path):
        raise FileNotFoundError(f"{otel_col_path} binary not found. Please install first.")

    os.environ['CORALOGIX_SUBSYS_NAME'] = socket.gethostname()

    if os.path.isfile('.env'):
        with open('.env') as f:
            for line in f:
                key, value = line.strip().split('=', 1)
                os.environ[key] = value

    os.environ['CORALOGIX_DOMAIN'] = CORALOGIX_DOMAIN
    os.environ['CORALOGIX_APP_NAME'] = CORALOGIX_APP_NAME

    print("Starting OpenTelemetry Collector...")
    process = subprocess.Popen([os.path.join(os.getcwd(), _OTEL_CONTRIB_DIR, 'otelcol-contrib'), '--config', config_file])
    with open(OTEL_PID, 'w') as otel_pid:
        otel_pid.write(str(process.pid))
    print(
        f"OpenTelemetry Collector is running in the background with APP_NAME: "
        f"{os.environ['CORALOGIX_APP_NAME']} and Subsystem: "
        f"{os.environ['CORALOGIX_SUBSYS_NAME']}")
```

The `run` command in the CLI tool is designed to start the OpenTelemetry Collector with a specified configuration. This command is crucial as it activates the collector, allowing it to begin its telemetry data collection and processing.

The function starts by setting the default binary name to `otelcol-contrib`.
It then checks if the platform is Windows `(sys.platform == 'win32')`. For Windows, it appends .exe to the binary name, accommodating the typical executable format in Windows.

The script constructs the full path to the binary using `os.path.join`, combining the current working directory, the _OTEL_CONTRIB_DIR, and the binary name.
If the binary does not exist at the constructed path, a FileNotFoundError is raised, prompting the user to install the binary first.

The script sets the `CORALOGIX_SUBSYS_NAME` environment variable to the hostname of the current machine, using `socket.gethostname()` (this is how the machine your'e monitoring will displayed in your future Coralogix dashboards).
It then reads environment variables from a `.env` file, if present, and sets them in the current environment.
The `CORALOGIX_DOMAIN` and `CORALOGIX_APP_NAME` are set to a predefined values (global variables above).

The script prints a message indicating the start of the OpenTelemetry Collector.
It uses `subprocess.Popen` to start the OpenTelemetry Collector in the background, passing the path to the binary and the configuration file as arguments.
The process ID (PID) of the started collector is written to a file named `OTEL_PID`. This PID is used later for stopping the collector.

After successfully starting the collector, the script prints a message with details about the running instance, including the APP_NAME and Subsystem, derived from the environment variables.

__stop command__

```python
@app.command()
def stop():
    '''Stop the OpenTelemetry Collector.'''
    if not os.path.exists(OTEL_PID):
        print("OpenTelemetry Collector is not running or pid file is missing.")
        return

    with open(OTEL_PID, 'r') as otel_pid:
        pid = int(otel_pid.read().strip())

    try:
        if sys.platform == 'win32':
            subprocess.run(['taskkill', '/F', '/PID', str(pid)], check=True)
        else:
            os.kill(pid, signal.SIGTERM)

        os.remove(OTEL_PID)
        print("OpenTelemetry Collector has been stopped.")
    except ProcessLookupError:
        print("Process not found. It may have already been stopped.")
    except Exception as e:
        print(f"Error stopping the process: {e}")
```

The `stop` command in the CLI tool is designed to safely terminate the OpenTelemetry Collector that's running in the background. This command is crucial for stopping the collector's processes and ensuring that resources are properly released.

The function first checks if the `OTEL_PID` file exists. This file contains the process ID (PID) of the running OpenTelemetry Collector. If the file does not exist, it indicates that the collector is not running, and the function returns after printing an appropriate message.

To read the file with the PID in it, for Windows systems `(sys.platform == 'win32')`, it uses the `subprocess.run` method to execute the `taskkill` command, forcibly terminating the process with the specified PID.
For other operating systems, it uses the `os.kill` function with the SIGTERM signal to terminate the process. This is a more Unix/Linux traditional way of handling process termination.

The script then removes the `OTEL_PID` file, signifying that the collector has been stopped.

The script also includes exception handling for situations where the process may not be found (ProcessLookupError) or other unexpected errors occur. This ensures that any issues during the stopping process are gracefully caught and reported to the user.

Eventually, the script prints a message to inform the user that the OpenTelemetry Collector has been stopped successfully, providing clear feedback on the action's outcome.

__uninstall command__

```python
@app.command()
def uninstall():
    '''Uninstalls the OpenTelemetry Collector files and binaries.'''
    if os.path.exists(_OTEL_CONTRIB_DIR):
        print(f"Uninstalling OpenTelemetry Collector from {_OTEL_CONTRIB_DIR}...")
        shutil.rmtree(_OTEL_CONTRIB_DIR)
        print("Un-installation complete. OpenTelemetry Collector has been removed.")
    else:
        print("OpenTelemetry Collector is not installed or has already been uninstalled.")
```

The `uninstall` command is a crucial component of the CLI tool, enabling users to remove the OpenTelemetry Collector and its associated files from their system. This command ensures that users can cleanly and easily reverse the installation process.

The command starts by checking if the `_OTEL_CONTRIB_DIR` directory exists. This directory is where the OpenTelemetry Collector's binaries and related files are stored post-installation. If the directory exists, indicating that the collector is installed, the script prints a message to inform the user that the uninstallation process has begun.

It then uses the `shutil.rmtree` function to recursively delete the _OTEL_CONTRIB_DIR directory, thereby removing all the files and binaries related to the OpenTelemetry Collector. This function is a powerful tool in Python for directory removal, capable of deleting a directory and all its contents.
After successful removal of the directory, the script prints a confirmation message indicating the completion of the uninstallation process.

If the _OTEL_CONTRIB_DIR directory does not exist, the script assumes that the OpenTelemetry Collector was never installed or has already been uninstalled. In such cases, it prints a message stating that the OpenTelemetry Collector is not installed or has already been removed.
This check prevents the script from attempting to delete non-existent directories, which could lead to errors.

## Usage

For convenience, add the `otel_cli` executable to your PATH and update its symlink to point the python binary. You can do that by running the following command (MacOS):

```bash
ln -s $PWD/otel_cli /usr/local/bin/otel_cli
```

To download the OpenTelemetry collector, run the following command:

```bash
otel_cli download
```

Then you can install the OpenTelemetry collector as a service by running the following command:

```bash
otel_cli install
```

You can start the OpenTelemetry collector by running the following command:

```bash
otel_cli run
```

You can stop it by running the following command:

```bash
otel_cli stop
```

You can uninstall it by running the following command:

```bash
otel_cli uninstall
```

For further help simply run:

```bash
otel_cli help
```

And it'll output all the available commands and their descriptions (taken from the functions docstring).
