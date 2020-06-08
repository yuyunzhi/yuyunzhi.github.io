const funDownload = (content, filename) => {
    const eleLink = document.createElement('a');
    eleLink.download = filename;
    eleLink.style.display = 'none';
    const blob = new Blob([content]);
    const objectUrl = URL.createObjectURL(blob);
    eleLink.href = objectUrl
    document.body.appendChild(eleLink);
    eleLink.click();    // 然后移除
    document.body.removeChild(eleLink);

    setTimeout(() => {
        window.URL.revokeObjectURL(objectUrl)
    }, 200)

    console.log('日志下载成功')
};
