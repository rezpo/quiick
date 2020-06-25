import React, { Component } from 'react'
import Wrapper from '../../components/wrapper/Wrapper'
import Body from './Body/Body'
import './Home.scss'

export default class Home extends Component {
  render() {
    return (
      <div className="home">
      <Wrapper>
        <Body />
      </Wrapper>
      </div>
    )
  }
}
