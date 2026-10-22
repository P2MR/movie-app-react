const initialState = {
    movies: [],
};

const movieReducer = (state = initialState, action) => {
    switch (action.type) {
        
        case 'ADD_MOVIES': 
            return {
                ...state,
                movies: [...state.movies, ...action.payload],
            };
        case 'SET_MOVIES':
            return {
                ...state,
                movies: action.payload
            }
        default:
            return state;
    }
};

export default movieReducer;