let returnResponseByPageAndPerPageValues = (response, page, perPage) => {
    let fromIndex = (page === 0) ? 0 : page * perPage;
    let toIndex = (page === 0) ? perPage : fromIndex + parseInt(perPage);
    return response.slice(fromIndex, toIndex);
};

export {returnResponseByPageAndPerPageValues};
