import React from "react";
import { Grid, Row, Col } from "react-bootstrap";
import inatjs from "inaturalistjs";
import _ from "lodash";
import UserImage from "../../../shared/components/user_image";
import GenerateStatsButton from "./generate_stats_button";
import Summary from "./summary";
import Observations from "./observations";
import Identifications from "./identifications";
import TaxaSunburst from "./taxa_sunburst";

const App = ( {
  year,
  user,
  currentUser,
  site,
  data
} ) => {
  let body = "todo";
  let inatUser = user ? new inatjs.User( user ) : null;
  if ( !year ) {
    body = (
      <p className="alert alert-warning">
        Not a valid year. Please choose a year between 1950 and { new Date().getYear() }.
      </p>
    );
  } else if ( !data || !currentUser || !currentUser.roles || currentUser.roles.indexOf( "admin" ) < 0 ) {
    if ( user && currentUser && user.id === currentUser.id ) {
      body = (
        <GenerateStatsButton user={ user } />
      );
    } else {
      body = (
        <p className="alert alert-warning">
          { I18n.t( "stats_for_this_year_have_not_been_generated" ) }
        </p>
      );
    }
  } else {
    body = (
      <div>
        <center>
          <a href="#sharing" className="btn btn-default btn-share">
            { I18n.t( "share" ) } <i className="fa fa-share-square-o"></i>
          </a>
        </center>
        <Summary data={data} />
        <Observations data={ data.observations } user={ user } year={ year } />
        <Identifications data={ data.identifications } />
        { user && data.taxa && data.taxa.tree_taxa && ( <TaxaSunburst data={ data.taxa.tree_taxa } /> ) }
        { user && currentUser && user.id === currentUser.id ? (
          <GenerateStatsButton user={ user } text={ "Regenerate Stats" } />
        ) : null }
        <a name="sharing"></a>
        <h2 id="sharing"><span>{ I18n.t( "share" ) }</span></h2>
        <center>
          <div
            className="fb-share-button"
            data-href={ window.location.toString( ).replace( /#.+/, "" )}
            data-layout="button"
            data-size="large"
            data-mobile-iframe="true"
          >
            <a
              className="fb-xfbml-parse-ignore"
              target="_blank"
              href={ `https://www.facebook.com/sharer/sharer.php?u=${window.location.toString( ).replace( /#.+/, "" )}&amp;src=sdkpreparse` }
            >
              { I18n.t( "facebook" ) }
            </a>
          </div>
          <a
            className="twitter-share-button"
            href={ `https://twitter.com/intent/tweet?text=Check+these+${year}+${site.site_name_short || site.name}+stats!&url=${window.location.toString( ).replace( /#.+/, "" )}` }
            data-size="large"
          >
            { I18n.t( "twitter" ) }
          </a>
        </center>
      </div>
    );
  }
  let montageObservations = [];
  if ( data && data.observations && data.observations.popular && data.observations.popular.length > 0 ) {
    montageObservations = _.filter( data.observations.popular, o => ( o.photos && o.photos.length > 0 ) );
    while ( montageObservations.length < 150 ) {
      montageObservations = montageObservations.concat( montageObservations );
    }
  }
  return (
    <div id="YearStats">
      <div className="banner">
        <div className="montage">
          <div className="photos">
            { _.map( montageObservations, ( o, i ) => (
              <a href={ `/observations/${o.id}` } key={ `montage-obs-${i}` }>
                <img
                  src={ o.photos[0].url.replace( "square", "thumb" ) }
                  width={ ( 50 / o.photos[0].original_dimensions.height ) * o.photos[0].original_dimensions.width }
                  height={ ( 50 / o.photos[0].original_dimensions.height ) * o.photos[0].original_dimensions.height }
                />
              </a>
            ) ) }
          </div>
        </div>
        { inatUser ? (
          <div>
            <UserImage user={ inatUser } />
            <div className="ribbon-container">
              <div className="ribbon">
                <div className="ribbon-content">
                  { inatUser.name ? `${inatUser.name} (${inatUser.login})` : inatUser.login }
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="protector">
            <div className="site-icon">
              <img src={ site.icon_url } />
            </div>
            <div className="ribbon-container">
              <div className="ribbon">
                <div className="ribbon-content">
                  { site.name }
                </div>
              </div>
            </div>
          </div>
        ) }

      </div>
      <Grid>
        <Row>
          <Col xs={ 12 }>
            <h1>
              {
                I18n.t( "year_in_review", {
                  year
                } )
              }
            </h1>
          </Col>
        </Row>
        <Row>
          <Col xs={ 12 }>
            { body }
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

App.propTypes = {
  year: React.PropTypes.number,
  user: React.PropTypes.object,
  currentUser: React.PropTypes.object,
  data: React.PropTypes.object,
  site: React.PropTypes.object
};

export default App;
