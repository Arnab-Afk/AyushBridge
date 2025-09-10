# AyushBridge CLI

A comprehensive command-line interface for the AyushBridge FHIR Backend, providing easy access to healthcare terminology management, code validation, translation between NAMASTE and ICD-11 TM2 systems, and more.

## Features

- ✅ **Health Monitoring**: Check server status and FHIR capabilities
- 🗂️ **Resource Management**: Full CRUD operations for FHIR resources
- 🔍 **Code Operations**: Lookup, validate, and translate medical codes
- 🌐 **Multi-System Support**: NAMASTE, ICD-11 TM2, and Unani systems
- 📊 **Multiple Output Formats**: Table and JSON views
- ⚙️ **Configuration Management**: Persistent settings and preferences
- 🔎 **Advanced Search**: Cross-resource search capabilities

## Installation

### Prerequisites

- Node.js 16.0.0 or higher
- Access to a running AyushBridge FHIR Backend server

### Install from Source

```bash
# Clone the repository (if not already done)
cd AyushBridge/cli

# Install dependencies
npm install

# Install globally for system-wide access
npm install -g .

# Or install locally and use npm scripts
npm link
```

### Quick Setup

```bash
# Initialize configuration
ayush config init

# Set server URL (if different from default)
ayush config set server http://your-server:3000

# Test connection
ayush health
```

## Usage

### Basic Commands

```bash
# Show help
ayush --help

# Check server health
ayush health

# Show current configuration
ayush config show
```

### CodeSystem Operations

```bash
# List all CodeSystems
ayush codesystem list

# Get specific CodeSystem
ayush codesystem get <id>

# Create CodeSystem from file
ayush codesystem create examples/codesystem-example.json

# Lookup code in CodeSystem
ayush codesystem lookup <codesystem-id> <code>

# Validate code in CodeSystem
ayush codesystem validate <codesystem-id> <code>
```

### ConceptMap Operations

```bash
# List all ConceptMaps
ayush conceptmap list

# Translate code using ConceptMap
ayush conceptmap translate <conceptmap-id> <code> --system <source-system-uri>

# Get ConceptMap details
ayush conceptmap get <id>
```

### Terminology Operations

```bash
# Translate NAMASTE code to ICD-11 TM2
ayush terminology namaste-to-icd11 <namaste-code>

# Lookup ICD-11 TM2 code details
ayush terminology icd11-lookup <icd11-code>

# List available code systems
ayush terminology systems
```

### Patient & Condition Management

```bash
# List patients
ayush patient list

# Create patient from file
ayush patient create examples/patient-example.json

# List conditions
ayush condition list

# Create condition from file
ayush condition create examples/condition-example.json
```

### Advanced Operations

```bash
# Search across all resources
ayush search --query "fever" --limit 10

# Validate code against any system
ayush validate --code "TM26.0" --system "http://id.who.int/icd11/mms"

# Translate between any two systems
ayush translate --code "SR11" --from "https://ayush.gov.in/fhir/CodeSystem/namaste" --to "http://id.who.int/icd11/mms"
```

## Configuration

The CLI uses a configuration file stored at `~/.ayushbridge/config.json`.

### Configuration Options

- `server`: FHIR server base URL (default: http://localhost:3000)
- `timeout`: Request timeout in milliseconds (default: 30000)
- `format`: Default output format - 'table' or 'json' (default: table)
- `verbose`: Enable verbose logging (default: false)
- `pageSize`: Default number of results per page (default: 10)

### Configuration Commands

```bash
# Initialize configuration
ayush config init

# Show current settings
ayush config show

# Set a value
ayush config set <key> <value>

# Reset to defaults
ayush config reset
```

## Examples

### Example Files

Generate example FHIR resource files:

```bash
# Create example files in current directory
node -e "require('./utils/file').createExampleFiles('./examples')"
```

This creates:
- `codesystem-example.json`
- `conceptmap-example.json` 
- `patient-example.json`
- `condition-example.json`

### Common Workflows

#### 1. Validate a NAMASTE Code

```bash
# First, find the NAMASTE CodeSystem ID
ayush terminology systems

# Validate the code
ayush codesystem validate cmfcyytj10000srbp2as56xqh SR11
```

#### 2. Translate NAMASTE to ICD-11

```bash
# Direct translation using built-in command
ayush terminology namaste-to-icd11 SR11

# Or use generic translate command
ayush translate --code SR11 --from "https://ayush.gov.in/fhir/CodeSystem/namaste" --to "http://id.who.int/icd11/mms"
```

#### 3. Search for Fever-related Conditions

```bash
# Search all resources for fever
ayush search --query fever

# Search only conditions
ayush search --query fever --type Condition
```

#### 4. Create and Manage a Patient

```bash
# Create patient from example
ayush patient create examples/patient-example.json

# List patients to get ID
ayush patient list

# Get patient details
ayush patient get <patient-id>
```

## Output Formats

### Table Format (Default)

Provides human-readable tabular output with color coding:

```bash
ayush codesystem list
```

### JSON Format

Provides complete machine-readable output:

```bash
ayush codesystem list --format json
```

## Key System IDs

For quick reference, here are the important CodeSystem IDs:

- **ICD-11 TM2**: `cmfcyyugq0007srbpohh1o7s9`
- **NAMASTE**: `cmfcyytj10000srbp2as56xqh`
- **Unani**: `cmfcz4ytd0000q19ju46acvl3`
- **NAMASTE to ICD-11 ConceptMap**: `cmfczxkcw0000pau5h8g5h76g`

## Error Handling

The CLI provides detailed error messages and troubleshooting guidance:

- Connection errors include server connectivity tips
- Validation errors show specific field issues
- Resource not found errors suggest alternatives
- Search with no results provides search improvement tips

## Command Reference

### Global Options

- `-v, --verbose`: Enable verbose output
- `-s, --server <url>`: Override server URL
- `-c, --config <path>`: Use custom config file
- `--help`: Show help for any command

### Resource Commands

All resource types support these patterns:

- `list`: List resources with pagination
- `get <id>`: Get specific resource by ID
- `create <file>`: Create resource from JSON file
- `update <id> <file>`: Update resource (where supported)
- `delete <id>`: Delete resource (where supported)

### Format Options

Most commands support:

- `-f, --format <type>`: Choose 'table' or 'json' output
- `-l, --limit <number>`: Limit number of results

## Troubleshooting

### Common Issues

1. **Connection Refused**
   ```
   Error: No response from server
   ```
   - Ensure the FHIR backend server is running
   - Check the server URL with `ayush config show`
   - Verify network connectivity

2. **Invalid JSON**
   ```
   Error: Failed to read JSON file
   ```
   - Validate JSON syntax
   - Ensure file exists and is readable

3. **Resource Not Found**
   ```
   Error: HTTP 404: Resource not found
   ```
   - Verify the resource ID is correct
   - Use list commands to find available resources

4. **Validation Errors**
   ```
   Error: Validation error: [field] is required
   ```
   - Check FHIR resource structure
   - Use example files as templates

### Debug Mode

Enable verbose logging to see detailed request/response information:

```bash
ayush --verbose health
ayush config set verbose true  # Persistent setting
```

## Development

### Building

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build standalone executables
npm run build
```

### Testing

```bash
# Run tests
npm test

# Test specific commands
ayush health --server http://localhost:3000
```

## License

This project is part of the AyushBridge healthcare terminology management system.

## Support

For issues and support:

1. Check the troubleshooting section above
2. Verify server connectivity with `ayush health`
3. Use `--verbose` flag for detailed error information
4. Check server logs for backend issues
