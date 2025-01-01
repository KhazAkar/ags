import './MainComponentStyle.css';

function MainComponent() {
  return (
    <div className="MainComponent">
      {/* 3 columns one row */}
      <div className="outerGrid"> 

        {/* 1column x 1row */}
        <div className="menuGrid"> 
          <div className="tempButton">

          </div>
          <div className="tempButton">

          </div>
          <div className="tempButton">

          </div>
          <div className="tempButton">

          </div>

          <div>

          </div>

          <div className="tempButton">

          </div>
        </div>

        {/* 3columns x 4rows */}
        <div className="centerGrid"> 

          <div className="content1">

          </div>
          <div className="content1">
            
          </div>
          <div className="content1">
            
          </div>

          <div className="content2a">
            
          </div>

          <div className="content2b">
            
          </div>

          <div className="content2c">
            
          </div>

          <div className="contentCam">
            
          </div>

        </div>

        {/* 1column x 2rows */}
        <div className="rightGrid"> 

            <div className="content4">
            </div>
  
            <div className="content5">
            </div>

        </div>
      </div>
    </div>
  );
}

export default MainComponent;
