
import sys
import json

def summarize_health_records(records):
    # Simple summarization logic for testing
    if not records:
        return "No health records available."
    
    # Create a summary based on filenames and mimetypes
    summary = "Health Records Summary:\n"
    for record in records:
        summary += f"File: {record['filename']}, Type: {record['mimetype']}\n"
    
    return summary.strip()

if __name__ == "__main__":
    try:
        # Read JSON input from stdin
        input_json = sys.stdin.read()
        data = json.loads(input_json)

        # Generate summary
        summary = summarize_health_records(data.get('healthRecords', []))
        
        # Print the summary to stdout in JSON format
        print(json.dumps({"summary": summary}))
    
    except json.JSONDecodeError as e:
        print(json.dumps({"error": f"Error decoding JSON: {e}"}), file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": f"Error: {e}"}), file=sys.stderr)
        sys.exit(1)
