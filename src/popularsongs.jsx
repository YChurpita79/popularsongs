import React, { PropTypes } from 'react';
import './popularsongs.scss';
import { withRouter } from "react-router-dom";

class PopularSongs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            groupName:'',
            pressedAlbum:'',
            albumItm:0,
            lineInterval:100,
            lineLength:0,
            lineCount:0,
            lenghAlblengh:0
        };

        this.sLine = null;
        this.fAlbumWraps = null;
        this.fAlbumSline = null;
        this.fSliderWraps = null;
    }

    componentDidUpdate() {
        this.initSlider();
    };

    componentWillMount() {
        this.props.songsStat();
    };

    componentDidMount() {
        this.fAlbumWraps = document.getElementsByClassName("feplay-popular-wrap");
        this.fSliderWraps = document.getElementsByClassName("feplay-popular-slide-wrap");
        let mself = this;
        window.onresize = function (){
            mself.initSlider();
        };
        this.clLeft();
    };


    getSongsIndex = (aVar) => {
        let i ;
        for(i = 0 ; i < this.props.SongsBuff.length ; i ++ ){
            if (this.props.SongsBuff[i].songs_name === aVar){
                break;
            };
        };
        return i;
    };

    getAlbum = () => {

        const { SongsStatBuf,
                onGetSongsList,
                onSetAlbumPoster,
                onSetPlayName,
                onSetPlaySongs,
                onSetPlayIndex,
                onGetGroupAlbum } = this.props ;

        if( SongsStatBuf !== null ) {

            this.state.albumItm = SongsStatBuf.SongsStatBuf.length;

            return (
                SongsStatBuf.SongsStatBuf.map((item, i, arr) => {

                    const albumClick = () => {
                        let albumIndex = this.getSongsIndex(arr[i].songs_name);
                        onGetSongsList(arr[i].album_name);
                        onSetAlbumPoster('media/'+arr[i].group_name +'/'+arr[i].album_name+'/'+arr[i].poster_link+'/'+arr[i].poster_fname );
                        onSetPlayName(arr[i].songs_name);
                        onSetPlaySongs('media/' + arr[i].group_name  + '/' + arr[i].folder_link + arr[i].songs_fname);
                        onSetPlayIndex(albumIndex);
                        onGetGroupAlbum(arr[i].group_name);
                        this.props.history.push('/player');
                    };

                    return (
                        <div key={"feplay-popular-key-" + i} id = {"feplay-popular-wrap-" + i}
                             className="feplay-popular-wrap" onClick = {albumClick}>
                            <div key={"feplay-popular-poster-wrap" + i}>
                                <img className = "feplay-popular-poster"
                                         src = {'/media/' + arr[i].group_name + '/' + arr[i].album_name + '/' + arr[i].poster_link + '/' + arr[i].poster_fname}
                                         alt = "poster"
                                />
                            </div>
                            <div key = {"feplay-popular-name-" + i} className="feplay-popular-name">
                                <div className="feplay-popular-text-wrap"><h5>{arr[i].group_name}</h5>
                                    <p> {arr[i].songs_name} </p>
                                    <span>
                                        {arr[i].album_name}
                                        <br/>{arr[i].album_year}
                                    </span>
                                    </div>
                                </div>

                            </div>
                        );
                    })
            );
        };
    };

    clLeft = () => {
        this.setLineSl('left');
    };

    clRight = () => {
        this.setLineSl('right');
    };

    setLineSl = (aVar) => {
        if (aVar === "right"){
            if (this.state.lineCount < this.state.albumItm)  {
                this.state.lineCount ++ ;

                if (this.state.lineCount === this.state.albumItm){
                    this.state.lineCount = 0;
                };
            };

        };

        if (aVar === "left"){
            if (this.state.lineCount > 0){
                this.state.lineCount--;
            };

        };

        let lineLeft = -1 * (this.state.lineCount * this.state.lineInterval) ;
        this.fAlbumSline.style.setProperty("left", lineLeft + '%');
    };

    initSlider = () => {
        let screenw, sliderStyle, blItem ;

        try{
            sliderStyle = window.getComputedStyle(this.fSliderWraps[0],null).getPropertyValue("width");
            screenw = parseInt(sliderStyle ,10);

            if (screenw > 640){
                blItem = this.state.albumItm / 6;
            } else

            if ( (screenw < 640) && (screenw > 440) ){
                blItem = this.state.albumItm / 2;
            } else {
                blItem = this.state.albumItm;
            };

            if  (screenw < 640) {
                blItem = this.state.albumItm / 2;
            };


            if (blItem <= 1){
                this.state.lineLength = 100;

                if ( (screenw < 640) && (screenw > 480) ){
                    this.state.lenghAlblengh = this.state.lineLength / 2;
                } else{

                };

                if (screenw > 640){
                    this.state.lenghAlblengh = this.state.lineLength / 3;
                } else {

                };

            } else {
                this.state.lineLength = 100 * blItem;
                this.state.lenghAlblengh = this.state.lineLength / this.state.albumItm;//this.state.albumItm
            };

            this.state.lineInterval = this.state.lenghAlblengh;
            this.fAlbumSline.style.width = this.state.lineLength + "%";

            for (let i = 0; i < this.fAlbumWraps.length; i++) {
                this.fAlbumWraps[i].style.width = this.state.lineInterval + "%" ;
            };

        }catch(e){

        };
    };

    getAlbumCarusel(){

        return(
            <div className = "feplay-popular-slide-wrap" >
                <div className = "fepaly-popular-slider">
                    <i id = "popular-slide-left" className = "glyphicon glyphicon-chevron-left" onClick = {this.clLeft}></i>
                    <i id = "popular-slide-right" className="glyphicon glyphicon-chevron-right" onClick = {this.clRight}></i>
                    <div className="fepaly-popular-slider-hidden">
                        <div id = "fepaly-popular-slider-line-1" ref={ (div) => {this.fAlbumSline = div;} } className = "fepaly-popular-slider-line"  onLoad = {this.initSlider}>
                            {this.getAlbum()}
                        </div>
                    </div>
                </div>
            </div>

        );
    };


    render() {
        return (
            <section id = "popular-section-1" className = "feplay-popular-section">
                <div className = "container">
                    <h2>Популярні композиції</h2>
                    <div key = "feplay-popular-slide-1">
                        {this.getAlbumCarusel()}
                    </div>
                </div>
          </section>
        );

    };

};

export default withRouter(PopularSongs);
