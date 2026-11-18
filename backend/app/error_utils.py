"""
Error handling utilities for production-safe error responses.
"""

import logging
from typing import Tuple, Dict, Any

logger = logging.getLogger(__name__)


def sanitize_error_message(error: Exception, include_details: bool = False) -> str:
    """
    Sanitize error messages for API responses.
    
    In production, never expose internal error details to clients.
    Log full details server-side for debugging.
    
    Args:
        error: The exception to sanitize
        include_details: If True (dev only), include error details. If False (production), return generic message.
    
    Returns:
        Safe error message for client response
    """
    error_str = str(error)
    
    # Log full error server-side for debugging
    logger.error(f"API Error: {error_str}", exc_info=True)
    
    # Return generic message for production
    if include_details and error_str:
        # For development, include some details but avoid SQL/internal info
        if 'column' in error_str.lower() or 'table' in error_str.lower():
            return 'Invalid request data'
        if 'constraint' in error_str.lower():
            return 'Database constraint violated'
        return error_str
    
    # Production: always return generic message
    return 'An error occurred processing your request'


def api_error_response(error: Exception, status_code: int = 400, include_details: bool = False) -> Tuple[Dict[str, Any], int]:
    """
    Generate standardized API error response.
    
    Args:
        error: The exception to handle
        status_code: HTTP status code
        include_details: Include error details (dev only)
    
    Returns:
        Tuple of (response dict, status code)
    """
    from flask import current_app
    
    # In production, never include details
    details_enabled = current_app.config.get('DEBUG', False) and include_details
    message = sanitize_error_message(error, include_details=details_enabled)
    
    return ({'error': message}, status_code)
