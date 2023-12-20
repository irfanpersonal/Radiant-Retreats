import styled from 'styled-components';

const About = () => {
    return (
        <Wrapper>
            <h1 style={{textAlign: 'center', backgroundColor: 'black', color: 'white'}}>About</h1>
            <h2>Introduction</h2>
            <p>Radiant Retreats is an awesome booking app made using the SERN stack. In the following sections, I will highlight key features and improvements incorporated into this application compared to the previous ones.</p>
            <h2>Sequelize Associations Implementation</h2>
            <p>Utilizing Sequelize Associations, I successfully implemented the "ref, populate" effect, similar to Mongoose. This involved restructuring the traditional model layout to make it functional. The entire process has been thoroughly documented for reference.</p>
            <h2>Enhanced User Experience</h2>
            <p>In addition to the powerful payment system, the app boasts improved user experience through proper pagination and search functionality for listings. This facilitates easy navigation, allowing users to find specific listings, filter by country, and stay within their budget.</p>
            <h2>Simplified Page Navigation</h2>
            <p>Unlike previous projects that relied on complex useEffects, the application now directly utilizes extraReducers for page transitions. This removes the need for elaborate navigation tricks, resulting in a significant improvement in user interface design. Now if you make any feature through the Redux Toolkit it is now super simple.</p>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    background-color: white;
    padding: 1rem;
    border-radius: 0.75rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 70%;
    margin: 0 auto;
    h2 {
        color: black;
        margin: 1rem 0;
    }
    p {
        color: rgb(85, 85, 85);
        line-height: 1.6;
    }
`;

export default About;