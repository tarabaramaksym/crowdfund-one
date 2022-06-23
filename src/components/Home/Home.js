import axios from 'axios';
import { useEffect, useState } from 'react';
import { createCampaignContract } from '../../services/web3';
import LargeLoader from '../shared-components/Loader/LargeLoader';
import './Home.css';
import HotPanel from './HotPanel/HotPanel';

// let images = [
//   'https://i.picsum.photos/id/786/600/600.jpg?hmac=54zJJUQ2PXmIlQpvF5QfzIfDo1F7k0iRYhU_kxpqiNw',
//   'https://i.picsum.photos/id/804/600/600.jpg?hmac=UYNJif1Qw-vMx2F-S80OMk4v6k4b-m5-l43OELrFjrw',
//   'https://i.picsum.photos/id/1059/600/600.jpg?hmac=dcI2tdmoiTwbxMjmWrtO5TuRHRwPho50YlFMyIptCh8',
//   'https://i.picsum.photos/id/1043/600/600.jpg?hmac=DsWHLQk4bYsjDQ-1Zf7IrCUkDOARelMQvjlQgsdSPBU',
//   'https://i.picsum.photos/id/846/600/600.jpg?hmac=MFYWZVk6bFuBdHy3nihtDR8Tlswe7viptEZXlSAlMS0',
//   'https://i.picsum.photos/id/434/600/600.jpg?hmac=ZMYCRq--XgrkpxYkQXSu8e7Ni7BTectWcUSQAbGnQss',
//   'https://i.picsum.photos/id/79/600/600.jpg?hmac=_uT_boSmi0QxZjsyPsvayEDau2XA8XGt5L6l1jMh4VQ',
//   'https://i.picsum.photos/id/786/600/600.jpg?hmac=54zJJUQ2PXmIlQpvF5QfzIfDo1F7k0iRYhU_kxpqiNw',
//   'https://i.picsum.photos/id/804/600/600.jpg?hmac=UYNJif1Qw-vMx2F-S80OMk4v6k4b-m5-l43OELrFjrw',
//   'https://i.picsum.photos/id/203/600/600.jpg?hmac=OJojQJU3u5oaxjIZpFyHTD6NAh5fJbMkM1ei8CWfkTM',
//   'https://i.picsum.photos/id/931/600/600.jpg?hmac=664cxbDWyEXMeB0I1TEOmBtpNtwKvvU0UFymRyzzOUM',
//   'https://i.picsum.photos/id/69/600/600.jpg?hmac=DI4h2BoZcS_MhY0ugVYeVWLu6bMqyTnk1cF5Yyu-unE',
//   'https://i.picsum.photos/id/264/600/600.jpg?hmac=VPbNnIVYOxYgg-3UNZesTmvG4bnUzQnE9qoMAA871JY',
//   'https://i.picsum.photos/id/287/600/600.jpg?hmac=rzZBB5Aprh8vywvu-VklH3ELJl5UVTSi3q2H2RdyWPY',
//   'https://i.picsum.photos/id/287/600/600.jpg?hmac=rzZBB5Aprh8vywvu-VklH3ELJl5UVTSi3q2H2RdyWPY',
//   'https://i.picsum.photos/id/591/600/600.jpg?hmac=VHOBD_nuAQ3g4BYniMVDDOBnsRwQrTPtzx4EX_m_FOw',
//   'https://i.picsum.photos/id/266/600/600.jpg?hmac=2LAoAN420r2RHNVV0c2iQ4LuF_aO2aKIGHf_38n8SXY',
//   'https://i.picsum.photos/id/401/600/600.jpg?hmac=kmInLc4JtDzlTjaQYrK7Hb1T8MHt-DYN9xNy3e-whc4'
// ]

// let titles = [
//   'Game development',
//   'Donate money for the charity',
//   'This thing is gonna change how we do things',
//   'Cool idea I got',
//   'New type of car',
//   'Very innovative idea on how to do stuff',
//   'Change the world',
//   'Awesome Campaign',
//   'Put a man on Mars',
//   'Building a bridge',
//   'Exciting project',
//   'Decent project',
//   'Project'
// ]

// let descriptions = [
//   'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
//   'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
//   'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
//   'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
// ]

// const dummy = async (id) => {
//   let contract = await createCampaignContract('0xdf9752A0458a7cb6Aac74d8183cca66033bfcFa2', '10', '10000');

//   let data = {
//     contract: contract,
//     title: titles[id % (titles.length - 1)],
//     description: descriptions[id % (descriptions.length - 1)],
//     image: images[id % (images.length - 1)],
//     approvers: [],
//     user: {
//       address: '0xdf9752A0458a7cb6Aac74d8183cca66033bfcFa2',
//       owned: [],
//       approverTo: []
//     }, elements: [
//       {
//         content: titles[id % (titles.length - 1)],
//         elementType: {
//           name: 'mainHeading'
//         },
//         width: {
//           name: 'one'
//         },
//         textAlign: { name: 'left' },
//         color: { colorHTML: 'black' },
//         backgroundColor: { colorHTML: 'white' }
//       }
//     ]
//   };
//   axios.post('campaigns', data);


// }




// const getCampaigns = (id, count) => {
//   let campaigns = [];
//   for (let i = 0; i < count; i++) {
//     campaigns.push(
//       {
//         title: titles[id % (titles.length - 1)],
//         description: descriptions[id % (descriptions.length - 1)],
//         img: images[id % (images.length - 1)],
//         contract: '0x599223dEB461D2F5bA8384d14bE1B7030DEDf15D'
//       }
//     )
//     id++;
//   }
//   return campaigns;
// }

// const tset = async () => {
//   for (let i = 0; i < 80; i++) {
//     await dummy(i);
//   }
// }


const Home = props => {
  const [state, setState] = useState({
    loading: true,
    newCampaigns: '',
    trendingCampaigns: ''
  });

  useEffect(async () => {

    const trendingCampaigns = await axios.get('campaigns/trending');
    const newCampaigns = await axios.get('campaigns/new');
    setState(prevState => ({ loading: false, trendingCampaigns: trendingCampaigns.data, newCampaigns: newCampaigns.data }));
  }, []);

  return (
    state.loading ? <div style={{ width: '150px', margin: 'auto' }}><LargeLoader /></div> :
      <div className="home-container">
        <h2>Trending</h2>
        <div className="block">
          <HotPanel campaigns={state.trendingCampaigns}></HotPanel>
        </div>
        <h2>New arrivals</h2>
        <div className="block">

          <HotPanel campaigns={state.newCampaigns}></HotPanel>
        </div>



      </div>
  )
}

export default Home;