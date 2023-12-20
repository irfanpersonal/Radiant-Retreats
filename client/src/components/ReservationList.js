import ReservationItem from "./ReservationItem.js";
import {nanoid} from 'nanoid';

const ReservationList = ({data, title}) => {
    return (
        <section style={{border: '1px solid black', padding: '1rem', backgroundColor: 'white', borderRadius: '1rem'}}>
            <h1 style={{backgroundColor: 'black', color: 'white', textAlign: 'center'}}>{title}</h1>
            {!data?.length && (
                <h1 style={{marginTop: '1rem', textAlign: 'center'}}>No Reservations Found</h1>
            )}
            {data.map(item => {
                return (
                    <ReservationItem key={nanoid()} data={item}/>
                );
            })}
        </section>
    );
}

export default ReservationList;