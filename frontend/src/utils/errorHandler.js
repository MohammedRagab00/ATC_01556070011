// Custom notification system
const notifications = {
  success: (msg) => {
    console.log('Success:', msg);
    // You can implement your own notification UI here
  },
  error: (msg) => {
    console.error('Error:', msg);
    // You can implement your own notification UI here
  },
  warning: (msg) => {
    console.warn('Warning:', msg);
    // You can implement your own notification UI here
  }
};

export const handleApiError = (error, navigate) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    if (error.response.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      navigate('/login');
    } else {
      showWarningMessage(error.response.data.message || 'An error occurred');
    }
  } else if (error.request) {
    // The request was made but no response was received
    showWarningMessage('No response from server. Please try again later.');
  } else {
    // Something happened in setting up the request that triggered an Error
    showWarningMessage('An unexpected error occurred');
  }
};

export const showSuccessMessage = (msg) => {
  notifications.success(msg);
};

export const showWarningMessage = (msg) => {
  notifications.warning(msg);
}; 