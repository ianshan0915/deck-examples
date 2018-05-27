/* global document, fetch, window */
import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay.js';

// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

const tooltipStyle = {
  position: 'absolute',
  padding: '4px',
  background: 'rgba(0, 0, 0, 0.8)',
  color: '#fff',
  maxWidth: '300px',
  fontSize: '10px',
  zIndex: 9,
  pointerEvents: 'none'
};

// Source data CSV
const DATA_URL =
  'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/website/bart-stations.json'; // eslint-disable-line

class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        ...DeckGLOverlay.defaultViewport,
        width: 0,
        height: 0
      },
      data: null,
      tooltip: null
    };

    fetch(DATA_URL)
      .then(resp => resp.json())
      .then(data => this.setState({data}));
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize.bind(this));
    this._resize();
  }
  setTooltip(x, y, object) {    
    this.setState({x, y, tooltip: object});
  }
  _resize() {
    this._onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  _onViewportChange(viewport) {
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    });
  }
  _renderTooltip() {
    const {x, y, tooltip} = this.state;
    if(tooltip) {
        return tooltip && (
            <div style={{...tooltipStyle, top: y, left: x}}>
                { tooltip.toString().split('\n')
                    .map((str, i) => <p key={i}>{str}</p>) }
            </div>
            );
    }
    return null;
  }
  render() {
    const {viewport, data} = this.state;

    return (
      <MapGL
        {...viewport}
        onViewportChange={this._onViewportChange.bind(this)}
        mapboxApiAccessToken={MAPBOX_TOKEN}
      >
        {this._renderTooltip()}
        <DeckGLOverlay
          viewport={viewport}
          data={data}
          setTooltip = {this.setTooltip.bind(this)}
        />
      </MapGL>
    );
  }
}

render(<Root />, document.body.appendChild(document.createElement('div')));
