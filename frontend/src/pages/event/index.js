import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import RichTextEditor from 'react-rte';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import Toggle from 'material-ui/Toggle';
import PencilIcon from 'material-ui/svg-icons/content/create';
import moment from 'moment';
import Template from '../../templates/default';
import { isLoggedIn } from '../../utils';
import actions from './actions';
import styles from './styles';


const mapStateToProps = (state) => {
  const data = {
    event: state.event.event,
    eventStatus: state.event.status,
  };
  if (state.eventPublish.status === 'success') {
    data.event = state.eventPublish.event;
  }
  return data;
};


class Event extends React.Component {
  static propTypes = {
    event: PropTypes.object,
    eventError: PropTypes.string,
    get: PropTypes.func.isRequired,
    match: PropTypes.object,
    set: PropTypes.func.isRequired,
    publish: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
  }

  static defaultProps = {
    event: {
      markdown: '',
      title: '',
      published: false,
    },
  }

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.handleEditorChange = (value) => {
      this.setState({ value });
    };

    this.showMarkdownEditor = () => {
      if (isLoggedIn() && !this.state.showEditor) {
        this.setState({ showEditor: true });
      }
    };

    this.hideMarkdownEditor = () => {
      if (this.state.showEditor) {
        this.setState({ showEditor: false });
      }
    };

    this.saveMarkdown = () => {
      if (this.state.showEditor) {
        const fields = {
          markdown: this.state.value.toString('markdown'),
        };
        this.props.set(this.props.match.params.eventId, fields);
        this.props.get(this.props.match.params.eventId);
        this.setState({ showEditor: false });
      }
    };

    this.editTitle = () => {
      if (isLoggedIn()) {
        this.setState({ showTitleEditor: true });
      }
    };

    this.hideTitleEditor = () => {
      this.setState({ showTitleEditor: false });
    };

    this.saveTitle = () => {
      const fields = { title: this.state.title };
      this.props.set(this.props.match.params.eventId, fields);
      this.props.get(this.props.match.params.eventId);
      this.setState({ showTitleEditor: false });
    };

    this.handleTitleChange = (event, title) => {
      this.setState({ title });
    };

    this.saveDate = (event, rawDate) => {
      const fields = {
        date: moment(rawDate).format('YYYY-MM-DD'),
      };
      this.props.set(this.props.match.params.eventId, fields);
    };

    this.titleMouseOver = () => {
      if (isLoggedIn()) {
        this.setState({ overTitle: true });
      }
    };

    this.titleMouseLeave = () => {
      if (isLoggedIn()) {
        this.setState({ overTitle: false });
      }
    };

    this.dateMouseOver = () => {
      if (isLoggedIn()) {
        this.setState({ overDate: true });
      }
    };

    this.dateMouseLeave = () => {
      if (isLoggedIn()) {
        this.setState({ overDate: false });
      }
    };

    this.markdownMouseOver = () => {
      if (isLoggedIn()) {
        this.setState({ overMarkdown: true });
      }
    };

    this.markdownMouseLeave = () => {
      if (isLoggedIn()) {
        this.setState({ overMarkdown: false });
      }
    };

    this.togglePublished = (event, published) => {
      this.props.publish(this.props.match.params.eventId, { published });
    };

    this.handleDeleteDialogOpen = () => {
      this.setState({ deleteDialog: true });
    };

    this.handleDeleteDialogClose = () => {
      this.setState({ deleteDialog: false });
    };

    this.handleEventDelete = () => {
      this.props.remove(this.props.match.params.eventId);
      this.context.router.history.push('/events');
    };
  }

  state = {
    showEditor: false,
    showTitleEditor: false,
    value: RichTextEditor.createEmptyValue(),
    deleteDialog: false,
  }

  componentWillMount() {
    this.props.get(this.props.match.params.eventId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.event) {
      this.setState({
        title: nextProps.event.title,
        value: RichTextEditor.createValueFromString(
          nextProps.event.markdown,
          'markdown',
        ),
      });
    }
  }

  render() {
    const markdownPencil = this.state.overMarkdown ? <PencilIcon /> : null;
    const markdownComponent = this.state.showEditor
                            ? (
                              <div>
                                <RichTextEditor
                                  value={this.state.value}
                                  onChange={this.handleEditorChange}
                                />
                                <RaisedButton label="save" primary onClick={this.saveMarkdown} />
                                <RaisedButton label="cancel" onClick={this.hideMarkdownEditor} />
                              </div>
                            ) : (
                             <div>
                               <div onMouseOver={this.markdownMouseOver} onMouseLeave={this.markdownMouseLeave} style={styles.inlineBlock}>
                                 <ReactMarkdown
                                   source={this.props.event.markdown}
                                 />
                               </div>
                               {markdownPencil}
                             </div>
                            );
    const titlePencil = this.state.overTitle ? <PencilIcon /> : null;
    const publishedComponent = isLoggedIn()
                             ? (
                               <div>
                                 published
                                 <Toggle onToggle={this.togglePublished} toggled={this.props.event.published} />
                               </div>
                             ) : null;
    const titleComponent = this.state.showTitleEditor
                         ? (
                           <div>
                             <TextField
                               autoFocus
                               name="title"
                               defaultValue={this.props.event.title}
                               onChange={this.handleTitleChange}
                             />
                             <RaisedButton label="save" primary onClick={this.saveTitle} />
                             <RaisedButton label="cancel" onClick={this.hideTitleEditor} />
                           </div>
                         ) : (
                           <div style={styles.flex}>
                             <div>
                               <h1
                                 onMouseOver={this.titleMouseOver}
                                 onMouseLeave={this.titleMouseLeave}
                                 onClick={this.editTitle}
                                 style={styles.inlineBlock}
                               >
                                 {this.props.event.title}
                               </h1>
                               {titlePencil}
                             </div>
                             {publishedComponent}
                           </div>
                         );
    const date = this.props.event.date ? new Date(this.props.event.date) : new Date();
    const datePencil = this.state.overDate ? <PencilIcon /> : null;
    const deleteButton = isLoggedIn()
                       ? <RaisedButton
                           label="delete"
                           onClick={this.handleDeleteDialogOpen}
                           secondary
                         />
                       : null;
    const content = this.props.eventStatus === 'error'
                  ? (
                    <h1>No such event</h1>
                  ) : (
                    <div>
                      <div style={styles.meta}>
                        <div>
                          {titleComponent}
                          <DatePicker
                            hintText="Portrait Inline Dialog"
                            container="inline"
                            defaultDate={date}
                            disabled={!isLoggedIn()}
                            onChange={this.saveDate}
                            onMouseOver={this.dateMouseOver}
                            onMouseLeave={this.dateMouseLeave}
                            style={styles.inlineBlock}
                          />
                          {datePencil}
                        </div>
                      </div>
                      <div onClick={this.showMarkdownEditor}>
                        {markdownComponent}
                      </div>
                      {deleteButton}
                    </div>
                  );
    const actions = [
      <FlatButton
        label="Cancel"
        onClick={this.handleDeleteDialogClose}
      />,
      <FlatButton
        primary
        label="OK"
        onClick={this.handleEventDelete}
      />,
    ];
    return (
      <Template>
        <Paper style={styles.root}>
          {content}
          <Dialog
            title="Delete Event"
            open={this.state.deleteDialog}
            onRequestClose={this.handleEventClose}
            actions={actions}
          >
            Are you sure?
          </Dialog>
        </Paper>
      </Template>
    );
  }
}


export default connect(mapStateToProps, actions)(Event);
