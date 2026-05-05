
    const sortAsc = (arr, field) => {
        return arr.sort((a, b) => {
          if (a[field] > b[field]) { return 1; }
          if (b[field] > a[field]) { return -1; }
          return 0;
        })
      }
      
      const sortDesc = (arr, field) => {
        return arr.sort((a, b) => {
          if (a[field] > b[field]) { return -1; }
          if (b[field] > a[field]) { return 1; }
          return 0;
        })
      }
      
    const sortJson = {
        sortDesc,
        sortAsc
    };



export default sortJson;