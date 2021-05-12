/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
import React, { PureComponent, RefObject } from "react";
import WaveSurfer from "wavesurfer.js";

export interface InjectedWaveformProps {
  isStartPlaying: boolean;
  isTrackPlaying: () => boolean;
  handlePlay: () => void;
  downloadLink: string;
  currentDuration: string;
  totalDuration: string;
  timeLeft: string;
  waveRef: RefObject<HTMLDivElement>;
  downloadFileName?: string;
  waveform?: WaveSurfer;
}

type TrackDuration = {
  totalDuration: string;
  currentDuration: string;
};

interface IProps {
  loaded: {
    file?: File;
    url?: string;
  };
  render: <T>(props: T & InjectedWaveformProps) => JSX.Element;
  handleTrackDuration?: (value: TrackDuration) => void;
  customOptions?: Omit<WaveSurfer.WaveSurferParams, "container">;
  index?: number;
}

interface IState {
  playing: boolean;
  isStartPlaying: boolean;
  downloadLink: string;
  totalDuration: string;
  currentDuration: string;
  timeLeft: string;
  waveRef: RefObject<HTMLDivElement>;
}
export default class WaveformProvider extends PureComponent<IProps, IState> {
  waveform: WaveSurfer | undefined;

  state = {
    playing: false,
    isStartPlaying: false,
    downloadLink: "",
    totalDuration: "",
    currentDuration: "",
    timeLeft: "",
    waveRef: React.createRef<HTMLDivElement>(),
  };

  componentDidMount() {
    if (this.state.waveRef.current) {
      this.waveform = WaveSurfer.create({
        barWidth: 1,
        barGap: 2,
        cursorWidth: 1,
        container: this.state.waveRef.current,
        backend: "WebAudio",
        height: 20,
        responsive: true,
        progressColor: "blue",
        waveColor: "grey",
        cursorColor: "transparent",
        ...this.props.customOptions,
      });

      if (this.props.loaded.url) {
        this.waveform.load(this.props.loaded.url);
      } else if (this.props.loaded.file) {
        this.waveform.loadBlob(this.props.loaded.file);
        const downloadLink = URL.createObjectURL(this.props.loaded.file);
        this.setState({ downloadLink });
      }

      // Show current time
      this.waveform.on("audioprocess", () => {
        if (this.waveform) {
          this.setState({
            currentDuration: this.formatTime(this.waveform.getCurrentTime()),
          });
          this.handleTimeLeft();
        }
      });

      // Show clip duration
      this.waveform.on("ready", () => {
        if (this.waveform) {
          this.setState({
            totalDuration: this.formatTime(this.waveform.getDuration()),
          });

          // eslint-disable-next-line no-unused-expressions
          this.props.handleTrackDuration &&
            this.props.handleTrackDuration({
              totalDuration: this.state.totalDuration,
              currentDuration: this.state.currentDuration,
            });
        }
      });

      this.waveform.on("finish", () => {
        if (this.waveform) {
          this.setState({
            playing: false,
          });
        }
      });
    }
  }

  componentWillUnmount() {
    console.log("we destroy waveform");
    this.waveform?.destroy();
  }

  handlePlay = () => {
    if (this.waveform) {
      if (!this.state.isStartPlaying)
        this.setState((prevState) => ({ isStartPlaying: true }));
      this.setState((prevState) => ({ playing: !prevState.playing }));
      this.waveform.playPause();
    }
  };

  isTrackPlaying = () => {
    if (this.waveform) {
      console.log(this.waveform.getCurrentTime());
      return this.waveform.isPlaying();
    }
    return false;
  };

  handleTimeLeft = () => {
    if (this.waveform) {
      const absoluteValue = Math.abs(
        this.waveform.getCurrentTime() - this.waveform.getDuration()
      );
      this.setState({ timeLeft: this.formatTime(absoluteValue) });
    }
  };

  formatTime = function (time: number) {
    return [
      Math.floor((time % 3600) / 60), // minutes
      `00${Math.floor(time % 60)}`.slice(-2), // seconds
    ].join(":");
  };

  render() {
    const { render } = this.props;
    return render({
      isStartPlaying: this.state.isStartPlaying,
      isTrackPlaying: this.isTrackPlaying,
      handlePlay: this.handlePlay,
      downloadLink: this.state.downloadLink,
      downloadFileName: this.props.loaded.file?.name,
      currentDuration: this.state.currentDuration,
      totalDuration: this.state.totalDuration,
      waveform: this.waveform,
      timeLeft: this.state.timeLeft,
      waveRef: this.state.waveRef,
    });
  }
}
