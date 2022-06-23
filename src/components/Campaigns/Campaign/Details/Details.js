import { Link } from "react-router-dom";

const Details = props => {



  const renderDetails = () => {

    const {
      approversCount,
      hardcap,
      min,
      owner,
      value
    } = props.summary;

    const elements = [
      {
        title: 'Approvers count',
        value: approversCount,
        description: 'Approvers count is the amount of people who contributed more than minimum contribution to this campaign.'
      },
      {
        title: 'Target',
        value: hardcap + " ONE",
        description: 'This is the amount of money campaign needs to get before it will be able to use them.'
      },
      {
        title: 'Balance',
        value: value + " ONE",
        description: 'This is the amount of money campaign currently has.'
      },
      {
        title: 'Minimum contribution',
        value: min + " ONE",
        description: 'Minimal contribution is the minimal amount backer must contribute to get access to voting and chat features.'
      },
      {
        title: 'Owner',
        value: owner,
        description: 'Owner is the creator of the campaign, only he can create requests.',
        isLink: true
      }
    ]

    return (
      <div className="cards-details"> {
        elements.map(e => {
          return <div key={e.title} className="card" style={{ width: '450px' }} >
            <div className="card-body">
              <h6 className="card-title">{e.title}</h6>
              <h6 className="card-subtitle mb-2 text-muted">{e.isLink ? <Link to={`/profiles/${e.value}`}>{e.value}</Link> : e.value}</h6>
              <hr></hr>
              <p className="card-text">{e.description}</p>

            </div>
          </div>
        })}
      </div>)
  }

  return renderDetails();
}

export default Details;