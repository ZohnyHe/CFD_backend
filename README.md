# CFD_backend

對 CFD 的資料結構了解後，此專案要改善的是資料傳遞的速度，並建構簡易的帳管系統，簡述如下:

1. 與前端工程師溝通後，將資料改以 JSON 的型式存取。
2. 將類似屬性的資料集中、扁平化，以減少鍵的量，增加資料讀取的速度。
3. 將架構改為純後端，拓樸相關的操作在前端完成，並盡可能減少 API 的數量。
4. 改良 API 的命名集夾帶參數的方式、Clean code。

![image](https://user-images.githubusercontent.com/99318533/162603034-0ebfbde0-7bfd-46f6-ba67-c1fd783c4095.png)

實作方式:

設定好 Postgres 資料庫，並與後端連接。建立資料的 API (POST): data，參數為 userName, caseFolderName, caseName。
取資料的 API (GET):
1. userInfo/:userName
2. timeSteps/:userName/:caseName
3. attributes/:userName/:caseName
4. constData/:userName/:caseName
5. outputData，參數為 userName、caseName、timeIndex、temperature、velocity、carbonDioxide、oxygen

總結:

此專案的資料能順利與網頁前端 (Three.js + React) 串接，但若有多個使用者同時存取資料，伺服器仍會有超載的可能性。未來會考慮以串流，或資料庫僅存放本地端資料路徑的方式優化。
