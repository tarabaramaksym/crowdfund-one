import About from "./components/About/About";
import Campaign from "./components/Campaigns/Campaign/Campaign";
import Campaigns from "./components/Campaigns/Campaigns";
import Create from "./components/Campaigns/Create/Create";
import Governance from "./components/Governance/Governance";
import Home from "./components/Home/Home";
import Profile from "./components/Profile/Profile";
import Staking from "./components/Staking/Staking";
import Voting from "./components/Voting/Voting";

export default [
  { path: "/", name: "Home", Component: <Home /> },
  { path: "/start", name: "Start Campaign", Component: <Create /> },
  { path: "/list-campaigns", name: "Campaigns List", Component: <Campaigns /> },
  { path: "/list-campaigns/:contract", name: "Campaign", Component: <Campaign /> },
  { path: "/voting/:contract", name: "Campaign", Component: <Campaign /> },
  { path: "/:contract", name: "Campaign", Component: <Campaign /> },
  { path: "/profiles/:address", name: "Start Campaign", Component: <Profile /> },
  { path: "/voting", name: "Voting", Component: <Voting /> },
  { path: "/staking", name: "Staking", Component: <Staking /> },
  { path: "/governance", name: "Governance", Component: <Governance /> },
  { path: "/about", name: "About", Component: <About /> }
];
