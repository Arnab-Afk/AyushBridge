# Terminology Explorer

The Terminology Explorer is an interactive tool for searching, exploring, and translating medical terminology across traditional medicine systems using AyushBridge's FHIR-compliant API.

## Features

### 1. Search Terminology
- Search across multiple terminology systems (NAMASTE, ICD-11 TM2, Unani, ICD-11)
- Auto-complete suggestions as you type
- Filter results by terminology system
- View detailed information about each term

### 2. View Detailed Information
- Lookup detailed information about terminology codes
- View hierarchical relationships and parent/child terms
- Display properties, synonyms, and related codes
- Access detailed definitions and usage notes

### 3. Translate Between Coding Systems
- Translate codes between different terminology systems
- Convert NAMASTE codes to ICD-11 and vice versa
- View translation confidence scores and equivalence types
- Support for batch translation of multiple codes

## API Integration

The Terminology Explorer integrates with the following backend API endpoints:

- `GET /terminology/$autocomplete` - For term searching and auto-complete
- `GET /terminology/$dual-code-lookup` - For detailed code information
- `GET /terminology/$translate` - For translating between terminology systems

## Getting Started

1. Navigate to the Terminology Explorer at `/terminology-explorer`
2. Select the desired tab (Search, Details, or Translate)
3. Enter search terms or codes to explore
4. View results and interact with the data

## Development Notes

### Technologies Used
- React with Next.js for the frontend interface
- Shadcn UI components for consistent design
- React Query for data fetching and caching
- Backend integration with fallback to mock data for demonstration

### Mock Data Support
The Terminology Explorer includes mock data support for demonstration purposes. To use:

- Set `useMockData` to `true` in each component to use mock data instead of API calls
- Mock data provides sample responses for all main features
- Toggle to `false` when the backend API is properly configured

### Error Handling
- Comprehensive error handling for API failures
- Clear error messages displayed to users
- Graceful fallback to mock data when configured

### Future Enhancements
- Advanced filtering options for search results
- Pagination for large result sets
- History tracking of searched terms and translations
- User preferences for default terminology systems
- Export functionality for search results and translations
