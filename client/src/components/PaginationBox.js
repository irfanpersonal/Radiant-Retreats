import {useDispatch} from "react-redux";
import {nanoid} from 'nanoid';

const PaginationBox = ({numberOfPages, page, setPage}) => {
    const dispatch = useDispatch();
    return (
        <div style={{textAlign: 'center', marginTop: '1rem'}}>
            {Array.from({length: numberOfPages}, (value, index) => {
                return (
                    <span onClick={() => {
                        dispatch(setPage(index + 1));
                    }} style={{backgroundColor: index + 1 === page && 'red', display: 'inline-block', padding: '1rem', border: '1px solid black', marginRight: '0.25rem'}} key={nanoid()}>{index + 1}</span>
                );
            })}
        </div>
    );
}

export default PaginationBox;