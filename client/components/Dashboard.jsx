import React, { Component } from 'react';

import { Jumbotron, Button } from 'react-bootstrap';

import ActiveCard from './ActiveCard';
import InactiveCard from './InactiveCard';
import EditCampaign from './EditCampaign';
import CreateCampaign from './CreateCampaign';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      artistName: this.props.artistName,
      campaigns: [],
      currentCampaign: {},
      showEditModal: false,
      showCreateModal: false,
      showDetailsModal: false,
    };
    this.assignCurrentCampaign = this.assignCurrentCampaign.bind(this);
    this.assignCurrentCampaignDetails = this.assignCurrentCampaignDetails.bind(
      this,
    );
    this.toggleCreateModal = this.toggleCreateModal.bind(this);
    this.toggleEditModal = this.toggleEditModal.bind(this);
    this.toggleDetailsModal = this.toggleDetailsModal.bind(this);
    this.loadArtistCampaigns = this.loadArtistCampaigns.bind(this);
    this.deactivateCampaign = this.deactivateCampaign.bind(this);
  }

  componentDidMount() {
    this.loadArtistCampaigns();
  }

  toggleCreateModal(show) {
    this.setState({ showCreateModal: show });
  }

  toggleEditModal(show) {
    this.setState({ showEditModal: show });
  }

  toggleDetailsModal(show) {
    this.setState({ showDetailsModal: show });
  }

  assignCurrentCampaign(id) {
    let currentCampaign = {};
    this.state.campaigns.forEach(campaign => {
      if (id === campaign.id) {
        currentCampaign = campaign;
      }
    });
    this.setState({ currentCampaign, showEditModal: true });
  }

  assignCurrentCampaignDetails(id) {
    let currentCampaign = {};
    this.state.campaigns.forEach(campaign => {
      if (id === campaign.id) {
        currentCampaign = campaign;
      }
    });
    this.setState({ currentCampaign, showDetailsModal: true });
  }

  loadArtistCampaigns() {
    fetch('/artist/dashboard/')
      .then(data => data.json())
      .then(res => {
        //all modals should be turned off upon any actions
        this.setState({
          campaigns: res.campaigns,
          showEditModal: false,
          showCreateModal: false,
        });
      })
      .catch(err => {
        console.log('Error retrieving campaigns: ', err);
      });
  }

  deactivateCampaign(campaignId) {
    fetch('/artist/deactivatecampaign', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: campaignId }),
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.loadArtistCampaigns();
      })
      .catch(err => {
        console.log('Error deactivating campaign: ', err);
      });
  }

  render() {
    const { campaigns } = this.state;
    const cards = campaigns.map((campaign, i) => {
      if (campaign.active) {
        return (
          <ActiveCard
            key={campaign.id}
            id={campaign.id}
            name={campaign.name}
            artistName={this.state.artistName}
            show={this.state.showDetailsModal}
            onClick={this.assignCurrentCampaign}
            showDetails={this.assignCurrentCampaignDetails}
            toggleDetailsModal={this.toggleDetailsModal}
            deactivate={this.deactivateCampaign}
          />
        );
      } else {
        return (
          <InactiveCard
            key={campaign.id}
            id={campaign.id}
            name={campaign.name}
            show={this.state.showDetailsModal}
            onClick={this.assignCurrentCampaign}
            showDetails={this.assignCurrentCampaignDetails}
            toggleDetailsModal={this.toggleDetailsModal}
          />
        );
      }
    });

    return (
      <div className="dashboard">
        <Jumbotron fluid>
          <h1>My Dashboard</h1>
        </Jumbotron>
        <div className="d-flex row">
          {cards}
          <Button
            className="createCampaign"
            onClick={() => {
              this.toggleCreateModal(true);
            }}
          >
            Create Campaign
          </Button>
        </div>
        <EditCampaign
          show={this.state.showEditModal}
          currentCampaign={this.state.currentCampaign}
          toggleEditModal={this.toggleEditModal}
          loadArtistCampaigns={this.loadArtistCampaigns}
        />
        <CreateCampaign
          show={this.state.showCreateModal}
          artistId={this.props.artistId}
          toggleCreateModal={this.toggleCreateModal}
          loadArtistCampaigns={this.loadArtistCampaigns}
        />
      </div>
    );
  }
}

export default Dashboard;
