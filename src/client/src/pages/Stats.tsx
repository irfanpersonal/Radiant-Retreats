import React, { ReactElement } from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {Loading} from '../components';
import {getGeneralStats, getAdvancedStats} from '../features/stats/statsThunk';
import {FaUsers, FaStar, FaList, FaCalendarCheck, FaUserFriends, FaMoneyBill} from 'react-icons/fa';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

const StatsDiv: React.FunctionComponent<{icon: ReactElement, title: string, value: string}> = ({icon, title, value }) => {
    return (
        <div className="stat-detail">
            <span>{title}</span>
            <div>{value}</div>
        </div>
    );
};

const StatsGraph: React.FunctionComponent<{data: any}> = ({data}) => {
    return (
        <LineChart width={700} height={400} data={data}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="month"/>
            <YAxis/>
            <Tooltip/>
            <Legend/>
            <Line type="monotone" dataKey="monthlyUsers" name="Monthly Users" stroke="#8884d8"/>
            <Line type="monotone" dataKey="monthlyReservations" name="Monthly Reservations" stroke="#82ca9d"/>
            <Line type="monotone" dataKey="monthlyListings" name="Monthly Listings" stroke="#ffc658"/>
            <Line type="monotone" dataKey="monthlyHostRequests" name="Monthly Host Requests" stroke="#FF5733"/>
            <Line type="monotone" dataKey="monthlyReviews" name="Monthly Reviews" stroke="#8e44ad"/>
        </LineChart>
    );
};

const Stats: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {getGeneralStatsLoading, generalStats, getAdvancedStatsLoading, advancedStats} = useSelector((store: useSelectorType) => store.stats);
    React.useEffect(() => {
        dispatch(getGeneralStats());
        dispatch(getAdvancedStats());
    }, []);
    return (
        <Wrapper>
            {getGeneralStatsLoading ? (
                <Loading title="Loading General Stats" position='normal'/>
            ) : (
                <div className="general-stats">
                    <div className="general-stats-row">
                        <StatsDiv icon={<FaUsers/>} title="User Count" value={String(generalStats!.userCount)}/>
                        <StatsDiv icon={<FaStar/>} title="Review Count" value={String(generalStats!.reviewCount)}/>
                        <StatsDiv icon={<FaList/>} title="Listing Count" value={String(generalStats!.listingCount)}/>
                    </div>

                    <div className="general-stats-row">
                        <StatsDiv icon={<FaCalendarCheck/>} title="Reservation Count" value={String(generalStats!.reservationCount)}/>
                        <StatsDiv icon={<FaUserFriends/>} title="Host Request Count" value={String(generalStats!.hostRequestCount)}/>
                        <StatsDiv icon={<FaMoneyBill/>} title="Total Grossed Money" value={`$${(generalStats!.totalProfit)}`}/>
                    </div>
                </div>
            )}
            {getAdvancedStatsLoading ? (
                <Loading title="Loading Advanced Stats" position='normal'/>
            ) : (
                <div className="advanced-stats">
                    <h1 className="title">Advanced Stats</h1>
                    <div className="stats-graph">
                        {(advancedStats!.monthlyUsers.length && advancedStats!.monthlyReservations.length && advancedStats!.monthlyListings.length && advancedStats!.monthlyHostRequests.length && advancedStats!.monthlyReviews.length) ? (
                            <StatsGraph data={Object.keys(advancedStats!).reduce((acc: any, key: string) => {
                                const seriesData = (advancedStats as any)[key].map((item: any) => ({
                                    ...item, [key]: item.count
                                }));
                                return [...acc, ...seriesData];
                            }, [])}/>
                        ) : (
                            <h1 style={{textAlign: 'center'}}>Not enough activity to make chart!</h1>
                        )}
                    </div>
                </div>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .general-stats {
        padding: 15px;
        display: flex;
        flex-direction: column;
        border-radius: 0px;
        background-color: #F5F5F4;
        border: 1px solid rgba(17, 17, 17, 0.04);
        .general-stats-row {
            display:flex;
            flex-direction:row;
        }
        .stat-detail {
            flex:1;
            margin:15px;
            padding:20px;
            display:flex;
            border-radius:20px;
            flex-direction:column;
            background-color:#FFFFFF;
            span {
                font-size:14px;
            }
            div {
                font-size:24px;
                font-weight:500;
                margin-top:6px;
            }
        }
        
        h1 {
            margin-bottom: 1rem;
            border-bottom: 1px solid black;
        }
    }
    .recharts-wrapper , .recharts-legend-wrapper {
        max-width:100%;
    }
    .advanced-stats {
        .title {
            padding:30px;
            font-size:24px;
            font-weight:500;
        }
        .stats-graph {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
    @media (max-width:768px) {
        .general-stats .general-stats-row {
            flex-direction:column;
        }
        .stats-graph {
            padding:0px 30px;
        }
    }
`;

export default Stats;