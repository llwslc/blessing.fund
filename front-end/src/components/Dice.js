import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button } from 'antd';

import { cutMiddle } from '../utils';

@inject('fund')
@observer
class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        Fund: <Button type="primary">{cutMiddle(this.props.fund.address)}</Button>
      </div>
    );
  }
}

export default About;
