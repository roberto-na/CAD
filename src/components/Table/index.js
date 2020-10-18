import React from 'react';
import DataTable from 'react-data-table-component';
import './style.css';
import sortIconSrc from './icon/sort-icon-down.svg';

const SortIcon = props => <img src={sortIconSrc} alt='sort' style={{ marginRight: '4px' }} />;

const customTheme = {
  rows: {
    borderWidth: '2px',
  }
};

class Table extends React.Component {
  state = {};

  onTableUpdate = (data) => {
    this.props.onTableUpdate && this.props.onTableUpdate(data);
  };

  onRowClicked = (data) => {
    this.props.onRowClicked && this.props.onRowClicked(data);
  };

  render() {
    return (
      <div
        className={`newtable ${this.props.shipping && 'padding'}  ${this.props.hideForSmall
          && 'hide-for-small-only'} ${this.props.marginTop}`}
      >
        <DataTable
          defaultSortAsc={this.props.defaultSortAsc}
          sortIcon={<SortIcon />}
          title={this.props.title}
          columns={this.props.columns}
          grow={this.props.grow}
          center={this.props.center}
          data={this.props.data}
          conditionalRowStyles={this.props.conditionalRowStyles}
          subHeader={!!this.props.subHeader}
          subHeaderAlign="left"
          className={this.props.className}
          clearSelectedRows={this.props.clearSelectedRows}
          subHeaderComponent={<div>{this.props.subHeader}</div>}
          keyField="id"
          onSelectedRowsChange={this.props.onSelectedRowsChange}
          onRowClicked={this.onRowClicked}
          pointerOnHover
          contextMessage={this.props.contextMessage}
          selectableRows={this.props.selectableRows ? this.props.selectableRows : false} // add for checkbox selection
          expandableRows={this.props.expandableRows ? this.props.expandableRows : false}
          customTheme={customTheme}
          noDataComponent={this.props.noDataComponent}
          expandableRowsComponent={this.props.expandableRowsComponent}
          defaultSortField={this.props.defaultSortField ? this.props.defaultSortField : null}
        />
      </div>
    );
  }
}

export default Table;
