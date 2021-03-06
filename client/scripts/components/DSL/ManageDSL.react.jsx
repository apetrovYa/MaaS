var React = require('react');
var Link = require('react-router').Link;
var Sidebar = require('../Sidebar.react.jsx');
var SessionStore = require('../../stores/SessionStore.react.jsx');
var UserStore = require('../../stores/UserStore.react.jsx');
var DSLStore = require('../../stores/DSLStore.react.jsx');
var RequestDSLActionCreator = require('../../actions/Request/RequestDSLActionCreator.react.jsx');
var RequestUserActionCreator = require('../../actions/Request/RequestUserActionCreator.react.jsx');

var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;

function getState() {
    var userId;
    if(SessionStore.getImpersonate() == "true")
    {
         userId = SessionStore.getUserId();
    }
    else
    {
        userId = UserStore.getId();
    }
    return {
            errors: DSLStore.getErrors(),
            isLogged: SessionStore.isLogged(),
            DSL_LIST: DSLStore.getDSLList(),
            role: UserStore.getRole(),
            userId: userId,
            type: "All"
    };
}

var ManageDSL = React.createClass({
    
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    
    getInitialState: function() {
        var state = getState();
        state.uploadErrors = [];
        return state;
    },
    
    componentWillMount: function() {
        DSLStore.addChangeListener(this._onChange);
        DSLStore.addUploadListener(this._onUpload);
        UserStore.addChangeListener(this._onUserChange);
        RequestUserActionCreator.getUser(this.state.userId);
        if(!this.props.children)
        {
            RequestDSLActionCreator.loadDSLList(SessionStore.getUserId());
         }
    },
    
    componentDidUpdate: function(prevProps) {
        if(!this.props.children && prevProps.children)  // from children to main page
        {
            RequestDSLActionCreator.loadDSLList(SessionStore.getUserId());
        }
    },

    componentWillUnmount: function() {
        DSLStore.removeChangeListener(this._onChange);
        DSLStore.removeUploadListener(this._onUpload);
        UserStore.removeChangeListener(this._onUserChange);
    },

    _onChange: function() {
        this.setState(getState());
    },
    
    _onUpload: function() {
        RequestDSLActionCreator.loadDSLAccess(DSLStore.getId(), this.state.userId);   // Load the new object to be visualized in the ManageDSL's table
    },
    
    _onUserChange: function() {
        this.setState({
            role: UserStore.getRole(),
            userId: UserStore.getId(),
        });
    },
    
    includeNameFormatter: function(cell, row) {
        return (
            <span className="table-link">{row.name}</span>
        );
    },
    
    nameFormatter: function(cell, row) {
        return (
            <Link to={"/manageDSL/executeDSL/" + row.id}>{row.name}</Link>
        );
    },
    
    buttonFormatter: function(cell, row) {
        var buttons;
        var errors;
        var errorId ="errorDropdown"+row.id;
        var deleteId ="deleteDropdown"+row.id;
        if(this.state.errors.length > 0)
        {
            errors = (
              <span id="errors">{this.state.errors}</span>
            );
        }
        var instance = this;
        var onClick = function() {
            if(instance.state.errors.length > 0)
            {
                document.getElementById(errorId).classList.toggle("dropdown-show");
            }
    		else
    		{
    		    document.getElementById(deleteId).classList.toggle("dropdown-show");
    		}
        };
        
        var confirmDelete = function() {
            RequestDSLActionCreator.deleteDSLDefinition(row.id);
        };
        
        var onDownloadSource = function() {
            var data = {
                name: row.name,
                dsl: row.source,
                type: row.type,
                database: row.externalDatabaseId
            };
            data = JSON.stringify(data);
            var filename = row.name + ".dsl";
            var blob = new Blob([data], {type: 'application/json'});
            
            if (typeof window.navigator.msSaveBlob !== 'undefined')
            {
                    // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
                    window.navigator.msSaveBlob(blob, filename);
            }
            else
            {
                var url = window.URL.createObjectURL(blob);
                var tempLink = document.createElement('a');
                tempLink.href = url;
                tempLink.setAttribute('download', filename);
                tempLink.click();
            }
        };
        
        var deleteDSL = (
            <div id="delete-user" className="pop-up">
                <i onClick={onClick} className="material-icons md-24 dropdown-button">&#xE5C9;</i>
                <div className="dropdown-content dropdown-popup" id={errorId}>
                    <p className="dropdown-title">Error</p>
                    <p className="dropdown-description">{errors}</p>
                    <div className="dropdown-buttons">
                        <button className="button">Ok</button>
                    </div>
                </div>
                <div className="dropdown-content dropdown-popup" id={deleteId}>
                    <p className="dropdown-title">Delete DSL definition</p>
                    <div className="dropdown-description">
                        <p>Are you sure you want to delete</p>
                        <p><span id="successful-email">{row.name}</span> DSL definition?</p>
                    </div>
                    <div className="dropdown-buttons">
                        <button className="inline-button">Cancel</button>
                        <button id="delete-button" className="inline-button" onClick={confirmDelete}>Delete</button>
                    </div>
                </div>
            </div>
        );
        
        if(this.state.role == "Owner" || this.state.role == "Administrator")
        {
            buttons = (
                <div>
                    <i onClick={onDownloadSource} className="dsl-download material-icons md-24">&#xE884;</i>
                    <Link to={"/manageDSL/manageDSLSource/" + row.id + '/edit' }><i className="modify-button material-icons md-24">&#xE254;</i></Link>
                    <Link to={"/manageDSL/manageDSLPermissions/" + row.id }><i className="dsl-change-permission material-icons md-24">&#xE32A;</i></Link>
                    {deleteDSL}
                </div>
            );
        }
        else
        {
            if(this.state.role == "Member" && row.permission == "read")
            {
                buttons = (
                    <div>
                        <Link to={"/manageDSL/manageDSLSource/" + row.id + '/view' }><i className="material-icons md-24">&#xE86F;</i></Link>
                    </div>
                );
            }
            
            if(this.state.role == "Member" && ( row.permission == "write" || row.createdBy == this.state.userId ))
            {
                buttons = (
                    <div>
                        <i onClick={onDownloadSource} className="dsl-download material-icons md-24">&#xE884;</i>
                        <Link to={"/manageDSL/manageDSLSource/" + row.id + '/edit' }><i className="material-icons md-24">&#xE254;</i></Link>
                        {deleteDSL}
                    </div>
                );
            }
            if(this.state.role == "Guest" && row.permission == "read")
            {
                buttons = (
                    <div>
                        <Link to={"/manageDSL/manageDSLSource/" + row.id + '/view' }><i className="material-icons md-24">&#xE86F;</i></Link>
                    </div>
                );
            }
        }
        
        return (
            <div className="table-buttons">
                {buttons}
            </div>
        );
    },
    
    onAllClick: function() {
        this.refs.table.handleFilterData({ });
        this.setState({type: "All"});
    },
    
    onDashboardsClick: function() {
        this.refs.table.handleFilterData({
            type: 'Dashboard'
        });
        this.setState({type: "Dashboards"});
    },
    
    onCollectionsClick: function() {
        this.refs.table.handleFilterData({
            type: 'Collection'
        });
        this.setState({type: "Collections"});
    },
    
    onDocumentsClick: function() {
        this.refs.table.handleFilterData({
            type: 'Document'
        });
        this.setState({type: "Documents"});
    },
    
    onCellsClick: function() {
        this.refs.table.handleFilterData({
            type: 'Cell'
        });
        this.setState({type: "Cells"});
    },
    
    deleteAllSelected: function() {
        if (this.refs.table.state.selectedRowKeys.length > 0)
        {
            RequestDSLActionCreator.deleteAllSelectedDSLDefinitions(this.refs.table.state.selectedRowKeys);
        }
    },

    onUploadSource: function() {
        var instance = this;
        var onFileSelect = function() {
            var file = tempLink.files[0];
            var size = file.size;   // file size in bytes
            if(file.name.endsWith('.dsl'))
            {
                if(size < 1048576)  // 1MB max
                {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        var data = reader.result;
                        try {
                            data = JSON.parse(data);
                            RequestDSLActionCreator.uploadDSLDefinition(instance.state.userId, data);
                        }
                        catch(error)
                        {
                            instance.setState({ uploadErrors: ["Error uploading selected file.", "Your file is corrupt"]});
                            instance.toggleErrorPopUp();
                        }
                    };
                    reader.readAsText(file);
                }
                else
                {
                    instance.setState({ uploadErrors: ["Selected file is too large.", "Please upload a file with size lower than 1 MB"]});
                    instance.toggleErrorPopUp();
                }
            }
            else
            {
                instance.setState({ uploadErrors: ["Selected file doesn't corrispond to a DSL definition.", "Please upload a \'.dsl\' definition file"]});
                instance.toggleErrorPopUp();
            }
        
        };
        
        var tempLink = document.createElement('input');
        tempLink.setAttribute('type', 'file');
        tempLink.addEventListener('change', onFileSelect);
        tempLink.click();
    },
    
    onDownloadAllSelectedSource: function() {
        if (this.refs.table.state.selectedRowKeys.length > 0)
        {
            for (var i = 0; i < this.state.DSL_LIST.length; i++)
            {
                var trovato = false;
                for (var j = 0; !trovato &&  j < this.refs.table.state.selectedRowKeys.length; j++)
                {
                    if (this.state.DSL_LIST[i].dslId == this.refs.table.state.selectedRowKeys[j])
                    {
                        trovato = true;
                        var data = {
                            name: this.state.DSL_LIST[i].dsl.name,
                            dsl: this.state.DSL_LIST[i].dsl.source,
                            type: this.state.DSL_LIST[i].dsl.type,
                            database: this.state.DSL_LIST[i].dsl.externalDatabaseId
                        };
                        data = JSON.stringify(data);
                        var filename = this.state.DSL_LIST[i].dsl.name + ".dsl";
                        var blob = new Blob([data], {type: 'application/json'});
                        if (typeof window.navigator.msSaveBlob !== 'undefined')
                        {
                                // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
                                window.navigator.msSaveBlob(blob, filename);
                        }
                        else
                        {
                            var url = window.URL.createObjectURL(blob);
                            var tempLink = document.createElement('a');
                            tempLink.href = url;
                            tempLink.setAttribute('download', filename);
                            tempLink.click();
                        }
                    }
                }
            }
        }
    },
    
    toggleErrorPopUp: function() {
		this.refs.error.classList.toggle("dropdown-show");
	},
    
    emptyUploadErrors: function() {
	    this.setState({ uploadErrors: [] });
	},
	
	onIncludeBack: function() {
	    const { router } = this.context;
	    RequestDSLActionCreator.handleIncludeDefinition("");
        router.push('/manageDSL/manageDSLSource');
	},
	
    render: function() {
        var title, content;
        if(this.props.children)
        {
            content = this.props.children;
        }
        else
        {
            if (this.props.mode != "include")
            {
                // SideBar initialization
                var all = {
                    label: "All",
                    onClick: this.onAllClick,
                    icon: (<i className="material-icons md-24">&#xE8EF;</i>)
                };
                var dashboards = {
                    label: "Dashboards",
                    onClick: this.onDashboardsClick,
                    icon: (<i className="material-icons md-24">&#xE871;</i>)
                };
                var collections = {
                    label: "Collections",
                    onClick: this.onCollectionsClick,
                    icon: (<i className="material-icons md-24">list</i>)
                };
                var documents = {
                    label: "Documents",
                    onClick: this.onDocumentsClick,
                    icon: (<i className="material-icons md-24">&#xE873;</i>)
                };
                var cells = {
                    label: "Cells",
                    onClick: this.onCellsClick,
                    icon: (<i className="material-icons md-24">&#xE3BC;</i>)
                };
                var sidebarData = [all, dashboards, collections, documents, cells];
                var selectRowProp = {
                    mode: "checkbox",
                    bgColor: "rgba(144, 238, 144, 0.42)"
                };
                var uploadErrors;
                if(this.state.uploadErrors.length > 0)
                {
                    uploadErrors = (
                        <div id="errors">
                            {this.state.uploadErrors.map((error, i) =>
                                <p className="error-item" key={i}>{error}</p>
                            )}
                        </div>
                    );
                }
            }
            
            var data = [];
            if(this.state.DSL_LIST && this.state.DSL_LIST.length > 0)
            {
                var instance = this;
                this.state.DSL_LIST.forEach(function(DSL, i) {
                    if((instance.props.mode == "include" && DSL.dsl.type != "Dashboard" 
                    && ((instance.props.currentDefinitionType == "Collection" && (DSL.dsl.type != "Cell" && DSL.dsl.type != "Collection")) || instance.props.currentDefinitionType != "Collection") )
                    || instance.props.mode != "include")
                    {
                        data.push({
                            id: DSL.dsl.id,
                            name: DSL.dsl.name,
                            source: DSL.dsl.source,
                            permission: DSL.permission,
                            type: DSL.dsl.type,
                            externalDatabaseId: DSL.dsl.externalDatabaseId
                        });
                    }
                });
            }
            var options;
            options = {
                noDataText: "There are no DSL definitions to display"
            };
            if (this.props.mode == "include")
            {
                const { router } = this.context;
                options = {
                    onRowClick: function(row){
                        RequestDSLActionCreator.handleIncludeDefinition(row.source);
                        router.push('/manageDSL/manageDSLSource');
                    },
                    noDataText: "There are no DSL definitions to display"
                };
            }
            title = "Manage your DSL definitions";
            content = (
                <div id="manage-dsl">
                    {this.props.mode != "include" ?
                        <Sidebar title="Filter DSL" data={sidebarData}/>
                        : "" }
                    <div className={this.props.mode == "include" ? "container" : "container  sidebar-container" }>
                        { this.props.mode == "include" ?
                        <div className="tooltip tooltip-bottom" id="editor-back-button">
                            <i onClick={this.onIncludeBack} className="material-icons md-48">&#xE15E;</i>
                            <p className="tooltip-text tooltip-text-short">Back</p>
                        </div>
                        : "" }
                        <p className="container-title">{title}</p>
                        {this.props.mode != "include" ?
                        <div id="table-top">
                            <p id="filter-type">{this.state.type}</p>
                            {this.state.role != "Guest" ?
                                <div className="top-buttons">
                                    <div className="tooltip tooltip-bottom" id="add-button">
                                        <Link to="/manageDSL/externalDatabases/select"><i className="material-icons md-48">&#xE147;</i></Link>
                                        <p className="tooltip-text tooltip-text-long">Create new DSL definition</p>
                                    </div>
                                    <div className="tooltip tooltip-bottom" id="downloadAllSelectedSource-button">
                                        <i onClick={this.onDownloadAllSelectedSource} className="material-icons md-48 dropdown-button">&#xE884;</i>
                                        <p className="tooltip-text tooltip-text-long">Download all selected DSL definitions</p>
                                    </div>
                                    <div className="tooltip tooltip-bottom" id="uploadSource-button">
                                        <i onClick={this.onUploadSource} className="material-icons md-48 dropdown-button">&#xE864;</i>
                                        <p className="tooltip-text tooltip-text-long">Upload a DSL definition</p>
                                    </div>
                                    <div className="tooltip tooltip-bottom" id="deleteAll-button">
                                        <i onClick={this.deleteAllSelected} className="material-icons md-48">&#xE92B;</i>
                                        <p className="tooltip-text tooltip-text-long">Delete all selected DSL definitions</p>
                                    </div>
                                </div>
                            : "" }
                        </div>
                        : "" }
                        <div id="table" className={this.props.mode == "include" ? "include-table" : ""}>
                            {this.props.mode != "include" ?
                            <BootstrapTable ref="table" data={data} pagination={true} 
                            search={true} striped={true} hover={true} selectRow={selectRowProp} options={options} keyField="id">
                                <TableHeaderColumn dataField="name" dataSort={true} dataFormat={this.nameFormatter} >Name</TableHeaderColumn>
                                <TableHeaderColumn dataField="type" dataSort={true}>Type</TableHeaderColumn>
                                <TableHeaderColumn dataField="buttons" dataFormat={this.buttonFormatter}></TableHeaderColumn>
                            </BootstrapTable>
                            :
                            <BootstrapTable ref="table" data={data} pagination={true} 
                            search={true} striped={true} hover={true} selectRow={selectRowProp} options={options} keyField="id">
                                <TableHeaderColumn dataField="name" dataSort={true} dataFormat={this.includeNameFormatter}>Name</TableHeaderColumn>
                                <TableHeaderColumn dataField="type" dataSort={true}>Type</TableHeaderColumn>
                            </BootstrapTable>
                            }
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div id="dsl">
                {content}
                {this.props.params != "include" ?
                <div className="dropdown-content dropdown-popup" ref="error">
                    <p className="dropdown-title">Error</p>
                    <div className="dropdown-description">{uploadErrors}</div>
                    <div className="dropdown-buttons">
                        <button onClick={this.emptySaveErrors} className="button">Ok</button>
                    </div>
                </div>
                : "" }
            </div>
        );
    }
});

module.exports = ManageDSL;