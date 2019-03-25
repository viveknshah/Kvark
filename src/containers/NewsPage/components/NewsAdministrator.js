import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

// Service imports
import NewsService from '../../../api/services/NewsService';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';

// Icons

// Project Components
import NewsItem from './NewsItem';
import NewsRenderer from './NewsRenderer';

// External Componentns
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import {convertToRaw } from 'draft-js';


const styles = {
    root: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        padding: '10px 10px',
        fontSize: 17,

        '@media only screen and (max-width: 1100px)': {
            gridTemplateColumns: '100%',
        }
    },
    content: {
        maxWidth: 800,
        display: 'block',
        margin: '30px auto',
    },
    newsItemWrapper: {
        
        /* maxWidth: 400,
        height: 300, */
        '@media only screen and (max-width: 1100px)': {
            order: 2,
        }
    },
    newsItem: {
        width: 400,
        height: 300,
        display: 'block',
        margin: 'auto',
    },
    newsRendererWrapper: {
        marginBottom: 300,

        '@media only screen and (max-width: 1100px)': {
            order: 1,
        }
    },
    padding: {
        padding: 20,
    },
    margin: {
        margin: 10,
    },
    editor: {
        border: '1px solid black',
        marginBottom: 30,
    },
};

class NewsRegistrator extends Component {

    constructor() {
        super();
        this.state = {
            h6: '',
            header: '',
            body: '',

            height: 0,
            width: 0,
            order: 0,

            image: '',
            imageAlt: '',

            editorSourceHTML: '',
        };
    }

    handleChange = (name) => (event) => {
        this.setState({[name]: event.target.value})
    }

    handleEditorChange = (editorState) => {
        const value = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        this.setState({body: value});
    }

    saveNews = (event) => {
        event.preventDefault();

        const item = {
            h6: this.state.h6,
            header: this.state.header,
            body: this.state.body,
            height: this.state.height,
            width: this.state.width,
            order: this.state.order,
            image: this.state.image,
            imageAlt: this.state.imageAlt,
        };

        // Fetch news item
        NewsService.createNewsItem(item, (isError, data) => {

        });
    }

    render() {
        const {h6, header, body, height, width, order, image, imageAlt} = this.state;
        const {classes} = this.props;
        const data = {h6: h6, header: header, body: body, image: image, imageAlt: imageAlt};

        return (
            <div className={classes.root}>
                <div className={classes.newsRendererWrapper}>
                    <Divider/>
                    <Typography className={classes.padding} variant='h6' align='center'>Preview</Typography>
                    <Divider/>
                    <NewsRenderer newsData={data} />
                </div>
                <form>
                    <Grid className={classes.content} container direction='column' wrap='nowrap' alignItems='center'>
                        <TextField className={classes.margin} fullWidth label='Tittel' value={h6} onChange={this.handleChange('h6')} required/>
                        <TextField className={classes.margin} fullWidth label='Header' value={header} onChange={this.handleChange('header')} required/>

                        <Typography className={classes.padding} variant='h6' align='center'>Images:</Typography>
                        <TextField className={classes.margin} fullWidth label='Image' value={image} onChange={this.handleChange('image')} required/>
                        <TextField className={classes.margin} fullWidth label='ImageAlt' value={imageAlt} onChange={this.handleChange('imageAlt')} required/>

                        <Typography className={classes.padding} variant='h6' align='center'>Content:</Typography>
                        <Editor wrapperClassName={classes.editor} onChange={(e) => console.log(e)} onEditorStateChange={this.handleEditorChange}/>

                        <Grid container direction='row' wrap='nowrap' >
                            <TextField className={classes.margin} label='Width' type='number' value={width} onChange={this.handleChange('width')} required/>
                            <TextField className={classes.margin} label='Height' type='number' value={height} onChange={this.handleChange('height')} required/>
                            <TextField className={classes.margin} label='Order' type='number' value={order} onChange={this.handleChange('order')} required/>
                        </Grid>

                        <Grid container direction='row' alignItems='center'>
                            <div><Switch color='primary'/></div>
                            <Typography className={classes.padding}  align='center'>Hide On Mobile</Typography>
                        </Grid>
                
                        <Button className={classes.padding} color='primary' variant='raised' onClick={this.saveNews} type='submit'>Save</Button>
                    </Grid>
                </form>
                <div className={classes.newsItemWrapper}>
                    <NewsItem className={classes.newsItem} data={data}/>
                </div>
            </div>
        );
    }
}

NewsRegistrator.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(NewsRegistrator);
