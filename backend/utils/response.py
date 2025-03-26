from typing import Tuple, Dict, Optional

# Generate error message in JSON format. Recommended approach instead of raising HTTPException.
def res_error(status_code: int, error_message: Optional[str] = None) -> Tuple[Dict[str, str], int]:
    if status_code == 404 and error_message == None:
        error_message = 'Not Found'
    elif status_code == 401 and error_message == None:
        error_message = 'Unauthorised'
    elif status_code == 400 and error_message == None:
        error_message = 'Bad Request'
    elif error_message == None:
        error_message = 'Error'
    return {"message": error_message}, status_code