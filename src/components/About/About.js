import './About.css';

const About = () => {
  return (
    <div className='about-container'>
      <section>
        <h2>About section</h2>
        <p>Crowdfund.one is the crowdfunding platform that uses smartcontracts and cryptocurrencies to facilitate safe and reliable way for backers to support campaing they are interested in with zero risks of being scammed.</p>
      </section>
      <hr></hr>
      <section>
        <h2>Guide section</h2>
      </section>
      <section>
        <h4>Setting up metamask</h4>
        <p>This guide assumes you are using chromium based browser. <br></br>First you need to set up metamask browser extension by going <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn">here.</a></p>
        <img src="https://i.imgur.com/5i82GFL.jpg"></img>
        <p>After installing metamask, depending on your browser it might appear in the right corner of your browser right away or maybe you will need to dig dipper into extensions manager. Either way we need to click on it to proceed to the next step.</p>
        <img src="https://i.imgur.com/EQTr1m4.png"></img>
        <p>After clicking on it we are met with greeting message, proceed by clicking get started. On the next slide it will ask us if we want to use seed phrase or set up a new wallet, we will choose second option, which will generate a new seed phrase for us.</p>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap'
        }}>
          <img src="https://i.imgur.com/nRMiZBR.png" style={{ width: '50%', objectFit: 'scale-down' }}></img>
          <img src="https://i.imgur.com/xItlJa2.png" style={{ width: '50%', objectFit: 'scale-down' }}></img>
        </div>

        <p>Next metamask will show us our seed phrase, you will need to write it down or screencap it as we will need it on the next step. You can also click "Remind me later" if you are not planning on using metamask for anything in the future. It's important to mention that you should never share this seed phrase as it will give full access to your wallet. In any case if you saved seed phrase or clicked "Remind me later" we will finally get access to metamask.</p>
        <img src=""></img>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap'
        }}>
          <img src="https://i.imgur.com/S5b4CwB.png" style={{ width: '50%', objectFit: 'scale-down' }}></img>
          <img src="https://i.imgur.com/WBhObmI.png" style={{ width: '50%', objectFit: 'scale-down' }}></img>
        </div>

      </section >

      <section>
        <h4>Setting up Harmony Testnet</h4>
        <p>Currently campaigns are being deployed on the harmony testnet this allows us to not use any real money while working with the blockchain while at the same time everything else works absolutely the same as it would on the mainnet. </p>
        <p>First step we will need to setup harmony network RPC. Proceed by going into <b>settings</b> in the metamask and after that go to the <b>Networks</b> tab and click on the "Add a network" button</p>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap'
        }}>
          <img src="https://i.imgur.com/QhUnHtZ.png" style={{ width: '50%', objectFit: 'scale-down' }}></img>
          <img src="https://i.imgur.com/LjdhxS1.png" style={{ width: '50%', objectFit: 'scale-down' }}></img>
        </div>


        <b>You will need to fill it out as follows:</b>

        <table style={{ width: '400px' }}>
          <tbody>
            <tr>
              <td>Network Name:</td>
              <td>Harmony Testnet</td>
            </tr>
            <tr>
              <td>New RPC URL:</td>
              <td>https://api.s0.b.hmny.io</td>
            </tr>
            <tr>
              <td>Chain ID:</td>
              <td>1666700000</td>
            </tr>
            <tr>
              <td>Currency Symbol:</td>
              <td>ONE</td>
            </tr>
            <tr>
              <td>Block Explorer URL:</td>
              <td>https://explorer.pops.one/</td>
            </tr>
          </tbody>
        </table>

        <p>After that it should automatically change to Harmony Test Network. We can change it back to ethereum main net, by clicking on the current selected network.</p>
        <img src=" https://i.imgur.com/KrdrwR7.png"></img>
      </section>

      <section>
        <h4>Getting test funds from the faucet</h4>
        <p>Now we will need to get us some funds on the test network. But first we need to transfer our ETH standard address to the ONE standard. To do this copy the address and change this links placeholder text to your address.</p>
        <b>https://explorer.pops.one/address/INPUTYOURADDRESSHERE</b>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap'
        }}>
          <img src="https://i.imgur.com/lY3qwCh.png" style={{ width: '50%', objectFit: 'scale-down' }}></img>
          <img src="https://i.imgur.com/xsPApEJ.png" style={{ width: '50%', objectFit: 'scale-down' }}></img>
        </div>

        <p>Copy paste your ONE address and proceed to the <a href="https://faucet.pops.one/">harmony faucet</a> where you can get 1000 ONE every 24 hours, 1000 ONE is more than enough for testing purposes.</p>

        <img src="https://i.imgur.com/wJU06hL.png"></img>
      </section>
    </div >
  );
}

export default About;