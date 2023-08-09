export const callApi = async (url, method = 'GET', data = null) => {
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : null,
      });
      
      
      // if (response.ok) {
      const responseData = await response.json();
      return responseData;
      // } else {
      //   throw new Error('API request failed');
      // }
    } catch (error) {
      throw new Error('API request failed');
    }
  }; 

