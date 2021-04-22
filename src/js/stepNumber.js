/*
* 计数器
* */
class StepNumber {
    constructor( _data, parent ) {
        this.data = _data;
        this.cacheStep = undefined;
        this.step = Number(_data.num.subtotal);
        this.maxNum = Number(_data.num.restNum);
        this.stepNumber = this.initCreate( parent );
    }

    initCreate( parent ) {
        if ( this.stepNumber ) return this.stepNumber;
        let div = $( "<div></div>" ).css( "position", "relative" ).appendTo( parent );
        let leftBn = $( "<button></button>" ).text( "-" ).appendTo( div );
        let input = $( "<input>" ).css({
            width:"50px",
            height:"19px",
            border:"1px solid #CCCCCC",
            borderLeft:"none",
            borderRight:"none",
            outline:"none",
            position:"relative",
            textAlign:"center"
        }).val( this.step ).appendTo( div );
        let rightBn = $( "<button></button>" ).text( "+" ).appendTo( div );
        let bnStyle={
            width:"25px",
            height:"25px",
            backgroundColor:"#FFFFFF",
            outline:"none",
            cursor: "pointer",
            position:"relative",
            border:"1px solid #CCCCCC"
        };
        Object.assign( leftBn.get(0), bnStyle );
        Object.assign( rightBn.get(0), bnStyle );

        this.bnClickBind = this.bnClickHandler.bind( this );
        this.inputBind = this.inputHandler.bind( this );
        leftBn.on( "click", this.bnClickBind );
        rightBn.on( "click", this.bnClickBind );
        input.on( "input", this.inputBind );
        return div;
    }

    bnClickHandler(e) {
        if ( e.currentTarget.textContent === "+" ) {
            console.log(this.maxNum, this.step);
            if ( this.step === 99 || this.maxNum < 1 ) return;
            // console.log(this.step, this.maxNum)
            this.setData( this.step + 1 );
        } else if ( e.currentTarget.textContent === "-" ) {
            if ( this.step === 1 ) return;
            this.setData( this.step - 1 );
        }
    }

    inputHandler(e) {
        let num = Number( e.currentTarget.value.replace( /\D|[\u4e00-\u9fa5]/g, "" ) );
        if ( num > this.maxNum ) num = this.maxNum;
        if ( num < 1 ) num = 1;
        this.setData( num );
    }

    setData( num ) {
        typeof this.cacheStep === 'undefined'
            ? this.cacheStep = this.step
            : false;
        this.step = num;
        this.stepNumber.children(1).val( num );
        // clearTimeout(this.id);
        // this.id = setTimeout( this.getOutData, 500, this );
        this.getOutData(this);
    }

    getOutData( self ) {
        let evt=new Event(StepNumber.CHANGE_STEP_NUMBER_EVENT);
        evt.data=self.data;
        evt.num=self.step;
        evt.changeNum = Number(self.step - self.cacheStep);
        self.cacheStep = undefined;
        document.dispatchEvent(evt);
        // self.id=0;
    }

    static get CHANGE_STEP_NUMBER_EVENT() {
        return "change_step_number_event";
    }
}