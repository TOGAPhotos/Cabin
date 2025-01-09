type Tool = 'cfd' | 'histogram' | 'RGBhistogram' | 'horizon' | 'center'

export function OpenToolWindow(tool:Tool,imageUrl:string){
    open(
        `/tool/${tool}.html?image=${imageUrl}`,
        "",
        "location=no,toolbar=no,width=1280,height=720"
    )!.focus();
}