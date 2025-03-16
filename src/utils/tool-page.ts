type Tool = 'cfd' | 'histogram' | 'histogramRGB' | 'horizon' | 'center'

export function OpenToolWindow(tool:Tool,imageUrl:string,mode:number=0){
    open(
        `/tool/${tool}.html?image=${imageUrl}&mode=${mode}`,
        "",
        "location=no,toolbar=no,width=1280,height=720"
    )!.focus();
}