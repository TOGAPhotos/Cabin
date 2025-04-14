export default class CosStrorage {
  static async uploadFile(url: string, file: BodyInit) {
    const res = await fetch(url, {
      method: "PUT",
      body: file,
    });
    if (!res.ok) throw new Error("上传失败");
    return res;
  }
}
