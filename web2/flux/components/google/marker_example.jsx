/*
 * look sass style for 'map-marker-holder.map-marker-holder--example' at web2/sass/examples/marker_example.sass
 */
import React, {PropTypes, Component} from 'react/addons';
import cx from 'classnames';

import shallowEqual from 'react/lib/shallowEqual.js';

export default class MarkerExample extends Component {
  static propTypes = {
    marker: PropTypes.any,
    hover: PropTypes.bool,
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState);
  }

  render() {
    this.was_hover = this.was_hover || this.props.hover;

    return (
      <div className={cx(
        'map-marker-holder map-marker-holder--example map-marker-holder--as hint hint--top hint--info hint-html',
        (this.props.hover) ? 'hint--always hover' : 'hint--hidden')}>
        <div className="map-marker map-marker--as"></div>
        <div className="hint-content noevents map-marker-holder__small-hint">
          <div>
            <strong>Название {this.props.marker.get('title')}</strong>
          </div>
          <div>
           <a className="ap-link">кликни на маркер для информации</a>
          </div>
        </div>
      </div>
    );
  }
}