var React = require('react');
var Link = require('react-router').Link;

var ReactBSTable = require('react-bootstrap-table');  
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;
var Sidebar = require('../Sidebar.react.jsx');
var SessionStore = require('../../stores/SessionStore.react.jsx');
var DSLStore = require('../../stores/DSLStore.react.jsx');
var UserStore = require('../../stores/UserStore.react.jsx');
var CompanyStore = require('../../stores/CompanyStore.react.jsx');
var RequestDSLActionCreator = require('../../actions/Request/RequestDSLActionCreator.react.jsx');


function getState() {
    return {
            errors: DSLStore.getErrors(),
            USER_LIST: DSLStore.getUserList()
    };
}

var ManageDSLPermissions = React.createClass({
    getInitialState: function() {
        return {
            errors: [],
            isLogged: SessionStore.isLogged(),
            role: UserStore.getRole(),
            userId: UserStore.getId(),
            roleFilter: "All",
            USER_LIST: []
        };
    },
    
    componentWillMount: function() {
        DSLStore.addChangeListener(this._onChange);
        RequestDSLActionCreator.loadUserList(this.props.params.definitionId, CompanyStore.getId());
    },
    
    componentWillUnmount: function() {
        DSLStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState(getState());
    },
    
    buttonFormatter: function(cell, row) {
        var selectId = row.id, instance = this;
        
        var changePermission = function() {
            var permission = document.getElementById(selectId).value;
            RequestDSLActionCreator.changeDSLDefinitionPermissions(instance.props.params.definitionId, row.id, permission);
        };
        
        return (
            <div className="table-buttons">
                <select id={selectId} onChange={changePermission} className="select" defaultValue={row.permission}>
                    <option value="none">None</option>
                    {row.role != "Guest" ? <option value="write">Write</option> : ""}
                    <option value="read">Read</option>
                    <option value="execute">Execute</option>
                </select>
            </div>
        );
    },
    
    onAllClick: function() {
        this.refs.table.handleFilterData({ });
        this.setState({roleFilter: "All"});
    },
    
    onMembersClick: function() {
        this.refs.table.handleFilterData({
            role: 'Member'
        });
        this.setState({roleFilter: "Members"});
    },
    
    onGuestsClick: function() {
        this.refs.table.handleFilterData({
            role: 'Guest'
        });
        this.setState({roleFilter: "Guests"});
    },
    
    changeAllSelected: function() {
        alert(this.refs.table.state.selectedRowKeys);
    },
    
    render: function() {
        var title,content, errors = [];
        
        // SideBar initialization
        var all = {
            label: "All",
            onClick: this.onAllClick,
            icon: (<i className="material-icons md-24">&#xE8EF;</i>)
        };
        var members = {
            label: "Members",
            onClick: this.onMembersClick,
            icon: (<i className="material-icons md-24">&#xE7FD;</i>)
        };
        var guests = {
            label: "Guests",
            onClick: this.onGuestsClick,
            icon: (<i className="material-icons md-24">&#xE7FF;</i>)
        };
        
        var data = [];
        var selectRowProp = {
            bgColor: "rgba(144, 238, 144, 0.42)"
        };
        
        var sidebarData = [all, members, guests];
        
        if(this.state.USER_LIST && this.state.USER_LIST.length > 0)
        {
            this.state.USER_LIST.forEach(function(user, i) {
                data[i] = {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    permission: user.permission ? user.permission : "none"
                };
            });
        }
        
        var options = {
            noDataText: "There are no users to display"
        };
        title = "Manage DSL definition permissions";
        content = (
            <div id="manage-dsl">
                <Sidebar title="Filter users" data={sidebarData}/>
                <div className="container sidebar-container">
                    <div className="tooltip tooltip-bottom" id="editor-back-button">
                        <Link to="manageDSL"><i className="material-icons md-48">&#xE15E;</i></Link>
                        <p className="tooltip-text tooltip-text-short">Back</p>
                    </div>
                    <p className="container-title">{title}</p>
                    <div id="table-top">
                        <p id="filter-type">{this.state.roleFilter}</p>
                    </div>
                    <div id="table">
                        <BootstrapTable ref="table" data={data} pagination={true} 
                        search={true} striped={true} hover={true} selectRow={selectRowProp} options={options} keyField="id">
                            <TableHeaderColumn dataField="email" dataSort={true}>Email</TableHeaderColumn>
                            <TableHeaderColumn dataField="role" dataSort={true}>Role</TableHeaderColumn>
                            <TableHeaderColumn dataField="buttons" dataFormat={this.buttonFormatter}>Access</TableHeaderColumn>
                        </BootstrapTable>
                    </div>
                </div>
            </div>
            );
        return (
            <div id="dsl-definition-permissions">
                {content}
            </div>
        );
    }
    
});

module.exports = ManageDSLPermissions;

/*
Guest: esecuzione
Member: Permesso di scrittura (sui propri)
Owner/Admin:  Permesso di scrittura (su tutti)
*/

/*
dsl1    Utente1  esecuzione
dsl1    Utente2  scrittura
dsl1    Utente3  lettura
dsl2    Utente3  esecuzione
*/

/*
Guest: esecuzione
Member: Permesso di scrittura (sui propri)
Owner/Admin:  Permesso di scrittura (su tutti)
*/

/*
Permesso = 'esecuzione', 'scrittura', 'lettura'
1) Permesso di scrittura: modifica + cancellazione + lettura + esecuzione
2) Permesso di lettura: lettura + esecuzione
3) Permesso di esecuzione: esecuzione
*/