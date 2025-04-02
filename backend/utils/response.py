"""Utility function related to API Response"""
from typing import Tuple, Dict, Optional

# Generate error message in JSON format. Recommended approach instead of raising HTTPException.
def res_error(status_code: int, error_message: Optional[str] = None) -> Tuple[Dict[str, str], int]:
    """
    Function that returns formatted response message for errors.
    """
    # Make sure there is error message
    if error_message is None:
        error_message = ''

    if status_code == 400:
        error_message = '400 Bad Request: ' + error_message
    elif status_code == 401 and error_message is None:
        error_message = '401 Unauthorised: ' + error_message
    elif status_code == 404 and error_message is None:
        error_message = '404 Not Found: ' + error_message
    else:
        error_message = 'Unknown Error: ' + error_message
    return {"message": error_message}, status_code
