import React, { Component } from 'react'
import Footer from '../../layouts/Home/Footer/Footer'
import Header from '../../layouts/Home/Header/Header'
import './Wrapper.scss'

export default class Wrapper extends Component {
  render() {
    return (
      <div className="wrapper-page">
        <Header />
        <main>
          {this.props.children}
        </main>
        <Footer />
      </div>
    )
  }
}
