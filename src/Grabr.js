import React, { Component } from "react";
import _ from "lodash";

export default class Grabr extends Component {
  constructor(props) {
    super(props);
    this.state = { term: "", data: [], active: false };

    this.onItemClick = this.onItemClick.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }
  onInputChange(value) {
    this.setState({ term: value });
    this.search();
  }
  search() {
    if (this.state.term != "") {
      const axios_data = this.props.createRequest(this.state.term);
      axios_data.request
        .then(response => {
          this.setState({ data: response.data.artists.items, active: true });
          if (axios_data.success) axios_data.success(response);
        })
        .catch(response => {
          this.setState({ data: [] });

          if (axios_data.error) axios_data.error(response);
        });
    } else {
      this.setState({ data: [] });
    }
  }
  onItemClick(item) {
    this.setState({ active: false });
    if (this.props.onItemClick) this.props.onItemClick(item);
  }
  renderItem(item) {
    const content = this.props.renderItem
      ? this.props.renderItem(item)
      : item.name;

    if (content)
      return (
        <li
          key={item.id}
          onClick={e => {
            this.onItemClick(item);
          }}
        >
          {content}
        </li>
      );
    else return false;
  }
  render() {
    const onInputChange = _.debounce(this.onInputChange, 300);
    return (
      <div>
        <div
          className="grabr_overlay"
          style={{
            display:
              this.state.data.length && this.state.active ? "block" : "none",
            opacity: this.state.data.length && this.state.active ? "1" : "0"
          }}
          onClick={e => this.setState({ active: false })}
        />
        <div className="grabr_content">
          <input
            type="text"
            name="searchbar"
            className="form-control"
            onChange={e => onInputChange(e.target.value)}
          />
          <ul
            className="grabr_datalist"
            style={{
              display:
                this.state.data.length && this.state.active ? "block" : "none"
            }}
          >
            {this.state.data.map(item => this.renderItem(item))}
          </ul>
        </div>
      </div>
    );
  }
}