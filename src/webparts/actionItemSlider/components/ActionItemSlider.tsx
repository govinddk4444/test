import * as React from "react";
import styles from "./ActionItemSlider.module.scss";
import { IActionItemSliderProps } from "./IActionItemSliderProps";
import { escape } from "@microsoft/sp-lodash-subset";
import { Carousel } from "react-responsive-carousel";
import { sp } from "@pnp/pnpjs";

export default class ActionItemSlider extends React.Component<
  IActionItemSliderProps,
  any
> {
  constructor(props: IActionItemSliderProps, state: any) {
    super(props, state);
    this.state = {
      imageMetaData: [],
      listTitle: "",
      selectedKeys: []
    };
    this.getListTitleById(this.props);
  }

  public getPageDetails = () => {
    if (this.state.listTitle !== "") {
      sp.web.lists
        .getByTitle(this.state.listTitle)
        .items.select(...this.state.selectedKeys)
        .get()
        .then((items: any[]) => {
          console.log(items);

          let images = [];
          items.map(item => {
            let image = {};
            if (item.Rollup_x0020_Image) {
              image = {
                imageUrl: item.Rollup_x0020_Image
                  ? item.Rollup_x0020_Image.Url
                  : "",
                title: item.Title
              };
            }
            if (!this.isEmpty(image)) {
              images.push(image);
            }
          });
          this.setState({
            imageMetaData: images
          });
        });
    }
  };

  public isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }

  // Set the List Title and the selected keys on Property change
  public getListTitleById = nxtProps => {
    sp.web.lists
      .getById(nxtProps.listIds)
      .select("Title")
      .get()
      .then((listProps: any) => {
        this.setState({
          listTitle: listProps.Title,
          selectedKeys: nxtProps.selectedKeys
        });
        this.getPageDetails();
      });
  };

  public renderImages = () => {
    return this.state.imageMetaData.map(image => {
      <div>
        <img src={image.imageUrl} />
        <p className="legend">{image.title}</p>
      </div>;
    });
  };

  public componentWillMount() {
    this.getPageDetails();
  }

  public componentWillReceiveProps(nextProps) {
    this.getListTitleById(nextProps);
  }

  public render(): React.ReactElement<IActionItemSliderProps> {
    console.log(this.props.selectedKeys);
    let images;
    if (this.state.imageMetaData.length > 0) {
      images = (
        <Carousel autoPlay={true} infiniteLoop>
          {this.state.imageMetaData.map((image, index) => {
            return (
              <div>
                <img src={image.imageUrl} />
                <p className="legend">{image.title}</p>
              </div>
            );
          })}
        </Carousel>
      );
    } else {
      images = <span> No Images Found </span>;
    }
    return (
      <div className={styles.actionItemSlider}>
        <div className={styles.container}>{images}</div>
      </div>
    );
  }
}
