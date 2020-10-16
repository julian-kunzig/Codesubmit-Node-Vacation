const errorMaker = (type, message, customName) => {
  let error = new Error(message);
  
  switch (type) {
    case 'UNAUTHORIZED':
      error.name = customName || 'UnauthorizedError';
      error.status = 401;
      error.message = error.message || 'Authentication required';
      
      break;
    
    case 'BAD_REQUEST':
      error.name = customName || 'BadRequest';
      error.status = 400;
      error.message = error.message || 'Invalid request';
      
      break;

    case 'UNPROCESSABLE_ENTITY':
      error.name = customName || 'BadRequest';
      error.status = 422;
      error.message = error.message || 'Entity does not exists';
      
      break;

    case 'BAD_PERMISSION':
      error.name = customName || 'BadPermission';
      error.status = 550;
      error.message = error.message || 'Permission Denied';
      
      break;
    
    default:
      error.name = customName || 'InternalServerError';
      error.status = 500;
      error.message = error.message || 'An error occurred';
      
      break;
  }

  return error;
};

module.exports = {
  errorMaker: errorMaker,
};
