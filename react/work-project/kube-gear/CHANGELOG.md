## 2022/01/19:

### feature

- 報表分析
  - 添加時間可選區段 ( 最近 15min / 最近 4hr )
  - 將各 tabs 原預設收尋選項 today 修改為 15min

## 2022/01/18:

### feature

- 左上 Logo 添加版本資訊

### Modify

- 組管理 移除組長、組員限制時長

## 2022/01/17:

### Modify

- 作業管理 修改限制作業時長文字

## 2022/01/14:

### Modify

- 報表分析
  - 用戶 tab 搜尋用戶欄位錯誤

- 作業管理
  - 剩餘時間顯示問題

## 2022/01/12:

### Modify

- 集中式存儲 / 分佈式存儲
  - 關閉多選下載功能
  - 修正路徑連結

### feature

- 集中式存儲 / 分佈式存儲
  - 優化下載，預防下載失敗問題

## 2022/01/06:

### Modify

- 集中式存儲 / 分佈式存儲
  - topbar 過濾選單

### feature

- 集中式存儲 / 分佈式存儲
  - 優化下載方式

## 2021/12/28:

### feature

- 更新 material UI Icon 檔案
- 新增 BaseMuiIcon component
- 作業管理
  - 部分 Icon，更新為 BaseMuiIcon

## 2021/12/27:

### Modify

- 集群管理 修改編輯資源單位名稱
- 資源管理 資源分配、資源編輯、新增集群、編輯集群，修改資源單位名稱

## 2021/12/23:

### feature

- 提交作業、排程管理、資源管理、新增排程、集群管理、模板管理
  - 資源單位統一格式

## 2021/12/09:

### feature

- 作業管理 新增操作區描述

### Modify

- 作業管理 打包容器 修改名稱與標籤規則

## 2021/05/28:

### Fix

- 作業管理 運行以外的狀態沒有停止選項，如果多選選項裡有運行狀態亦將創建改為停止

## 2021/05/26:

### Fix

- 首頁 FireFox瀏覽器左側導航欄，顯示大 right arrow icon

## 2021/05/19:

### Fix

- 組管理 組長：指派組長，若為下拉式選單則不顯示既有組長

## 2021/05/18:

### Fix

- 鏡像管理
  - 存儲圖表只有管理員能夠檢視
  - 內頁標籤頁表格跑版
- 作業管理 停止的作業應無法使用遠端桌面、Jupyter、Tensorboard

## 2021/05/07:

- 鏡像管理 下載至存儲
- 分布式/集中式存儲 上傳至鏡像管理

## 2021/05/05:

### Feat

- 鏡像管理 下載標籤至存儲

## 2021/05/03:

### Feat

- 鏡像管理
  - 刪除多個倉庫
  - 調整安全與隱私權按鈕
  - 刪除專案
  - 取得伺服器錯誤顯示
  - 操作刪除時將更新資料
  - 新增訪客權限

## 2021/04/14:

### Feat

- EN 翻譯更新
- 報表分析 更新 Prometheus，增加帳號密碼

### Fix

- 用戶管理 通知檢察機制導致沒有參數時跳出，用戶不存在提示

## 2021/04/09:

### Fix

- 報表分析 工作層 GPU 單位錯誤

# 2021/04/08:

### Fix

- 映像管理 硬碟使用率圖表顏色沒變

## 2021/04/06:

### Feat

- 檔案管理 返回時跳到該檔案的頁次、進入下一頁清空關鍵字

## 2021/03/29:

### Fix

- 報表分析 單節點，修正不顯示 gpu 圖表問題

## 2021/03/18:

### Modify

- 資源管理 創建修改資源、集群 欄位順序

## 2021/03/15:

### Fix

- 報表分析 單節點 & 作業 輸出報表錯誤
- 通知系統 創建排程無法選擇時間、跳轉連結時應關閉通知選單
- 提交作業 無法正確建立 glusterfs

## 2021/03/12:

### Fix

- 提交作業 簡易設置預設值

## 2021/03/11:

### Modify

- 翻譯相關調整

## 2021/03/10:

### Feature

- 通知系統 已讀 / 全部已讀 / 刪除 功能

### Fix

- 切換語系 hover 顏色

## 2021/03/08:

### Modify

- 分布式/集中式
  當選擇不公開(在 isPublic = true 及 isPublicOnly = true)，新增用戶選擇編輯要添加 canWriteUsers

## 2021/03/05:

### Feature

- 用戶管理 新增用戶，增加 glusterfs 欄位

### Fixed

- 分佈式存儲管理 無法修改可使用大小(GB)
- 用戶管理 新增用戶無法添加角色

## 2021/03/04:

### Fixed

- 分佈式存儲管理 參數名稱錯誤 isPublic

## 2021/03/03:

### Modify

- 隱藏部份左方選單列表
- 用戶管理 移除動作中，集中式存儲/分佈式存儲連結
- 修改上方選單 glusterfs icon
- 首頁 移除高性能運算

### Fixed

- 新增排程 起始時間檢查格式
- 集中式存儲/分佈式存儲 未正確抓取資料

## 2021/03/02:

### Feature

- 忘記密碼 cn.json resetNarrative 修改用語

### Modify

- 首頁 集群列表 使用中預設值移除

## 2021/02/26:

### Fixed

- 版本日誌 修正繁體中文部分內容是簡體中文
## 2021/02/26:

### Feat

- 節點管理 關機/重啟功能

## 2021/02/24:

### Fix

- 首頁 快速啟動Tab scollbar

### Feature

- 角色管理 可更改角色名稱

## 2021/02/22:

### Modify

- 首頁 集群列表 預設使用中

## 2021/02/20:

### Modify

- 首頁 作業狀態與快速啟動於小螢幕版面調整

## 2021/02/19:

### Modify

- 提交作業 cn.json 中 pleaseEnterAllTextFields 翻譯

## 2021/02/18:

### Fixed

- 忘記密碼 在寄送信件錯誤時，停止倒數秒數

## 2021/02/17

### Fixed

- 資源管理 修正資源分配與集群修改時，資料驗證問題

## 2021/02/08:

### Modify

- 忘記密碼 將標題「重設密碼」改為「忘記密碼」及簡體中文「口令牌」改為「口令」
- 時間顯示移除AM/PM
- 創建NFS 擁有者非必填
- 系統設置 「儲存」按鈕文字改為「確認」
- 登入註冊頁面 將 getAllowRegister API 儲存至 GlobalContext

## 2021/02/05:

### Modify

- 登入註冊 增加註冊設定
- i18n 移除 core 翻譯，全改為 CPU

## 2021/02/04:

### Modify

- 作業管理 提交時間參數不再變動單純顯示創建時間 createdTime
- i18n 簡體中文翻譯 系统
- 系統設置
  - 切分為三個分頁
  - 開放註冊功能、重複登入、作業審批
  - 提交作業切換簡易與專業按鈕時，將初始化相應設置
- 組管理 如果自己是組長，不可以將自己刪除，除非你的組上層還有組才可以將自己刪除
- 個人訊息 修正可用資源顯示 null

## 2021/02/03:

### Modify

- 提交作業 將系統設置設定添加至簡易模板與專業模版

## 2021/02/02:

### Fixed

- 新增排程/排程管理
  - gpuType 由 null 改為 ''
  - 模板管理 新增修改人員 dropdown 判斷自己是否具有管理權限
  - 起始時間與終止時間 timestamp 計算至分鐘，後面捨去
  - 檢視模板 板型調整
- 資源管理
  - 修改 modal 關閉時，應清空 state
- 集群管理
  - 修改 modal 關閉時，應清空 state

## 2021/01/28:

### Modify

- 新增排程/排程管理
    - 更新 ViewSchedule 版面
    - 步驟三 sharedMemoryMB 最小值為 0, memorySize 最小值為 512
    - 調整 schedule Callout style 及步驟內 style
    - 步驟二不能直接跳轉步驟四，需要經過步驟三檢查再做判斷進行跳轉
    - 修改排程 component ModifyScheduleModal.js 調整排版及 style
    - 新增排程 component CreateSchedule.js 調整 overflow，讓步驟三可以完全顯示，避免小螢幕無法顯示完全

## 2021/01/27:

### Feat

- 新增排程/排程管理 更新 updateJobSchedule API

### Modify

- 根目錄App 增加 material-ui theme，移除 BaseStepper 主題
- 用戶管理 增加判斷系統資源限制是否為空

## 2021/01/26:

### Modify

- 提交作業 提交時間移除 AM/PM
- 新增排程/排程管理 將 BaseStepper 重新定義，拆分步驟業務邏輯

## 2021/01/21:

### Feat

- 新增排程/排程管理 步驟三樣式調整
- 個人信息 排版調整


### Fix
- 角色管理
  1. API Error not catch
  2. Admin 不可修改

## 2021/01/20:

### Feat

- 新增排程/排程管理
  - 步驟一 預約排程 checkbox 改為 ChoiceGroup
  - 步驟三 增加集群狀態
- 作業管理
  1. 限制作業時長（小時）改成"限制時長（小時）"
  2. CPU核心數改成"CPU"
  3. 將所有顯示塞在13寸的螢幕上（Windows有要拉到最下面才能往右滑的問題）


### Fixed

- 模板管理 基本設置調整集群 Dropdown 及 taskRole 資源限制版面

## 2021/01/19:

### Feat

- 普通用戶不顯示資源管理
- 提交作業
  1. 任務實例不顯示
  2. 簡易版資源限制修改
  3. CPU核心數改為"CPU"
  4. 將用戶所設定的模式（簡易|專業）記錄到cookie，下次載入套用

### Fixed

- 新增排程/排程管理
  - 增加期使時間判斷邏輯，選擇開始時間5分鐘後
  - 移除步驟三任務實例
  - 修改 cn CPUcore 翻譯

### Fixed

- 新增排程/排程管理
  - 增加期使時間判斷邏輯，選擇開始時間5分鐘後
  - 移除步驟三任務實例
  - 修改 cn CPUcore 翻譯

## 2021/01/18:

### Feat

- 用戶管理 排版調整、資源限制加入級別

### Fixed

- 新增排程/排程管理 步驟一與步驟三的邏輯及版面上修改

## 2021/01/15:

### Fixed

- 組管理 一般使用者新增子組，新增組員onchange

## 2021/01/14:

### Modify

- 簡中語言包調整
- 硬件利用率 => 節點管理

### Fixed

- 新增排程/排程管理
  - Step1: spinBtn 添加自定義樣式、將步驟三任務數量移至步驟一、檢查終止時間不能小於起始時間
           排程管理 - 可以幫其他人添加排程
  - Step2: 根據步驟一任務數量檢查可使用模板
  - Step3: 共享記憶體不能大於系統記憶體(TaskRole)、TaskRole bar跑版、命令格式不正確
  - Step4: 修正 glusterfs 欄位不應是 nfs
  - Step5: 修正 nfs 統計數量未正確加總

- 模板管理
  - 命令格式不正確

---

## 2021/01/12:

### Fixed

- 排程管理 判斷顯示審批按鈕，待審批狀態的排程，顯示通過、拒絕的按鈕邏輯改為檢查結束時間
- 組管理 組長不能新增組長

---

## 2021/01/11:

### Modify

- 提交作業 完成條件 只能輸入 0 or 1
- 系統設置 版本日誌 拆分, Menu 移到用戶底下
- 提交作業 集群資源提示 每加一個 Task Role, 資源增加 1 CPU, 1024 MB Memory
- 新增排程/排程管理
  - 步驟組件UI、步驟一選擇日期可以輸入

### Fixed

- 報表分析/節點管理
  - 將百分比顯示調整至整數位

### Feature

- 首頁集群列表 Filter

---

## 2021/01/08:

### Fixed

- BaseComponents / BaseTable 修正當畫面縮小時表格，表格 Header 固定底下每一行跑版
- 排程管理、作業管理、模板管理 取得模板須先檢查 admin 權限再決定拉取 api
- 複製資料夾無窮迴圈

### Modify:

- 集群管理
  - 移除新增功能、新增過濾及排序功能
  - 增加資源欄位及可排程欄位

- 作業管理 加回舊版 jupyter lab

## 2021/01/07:

### Fixed:
- 集中式/分布式存儲 排序問題、表頭名稱

## 2021/01/06:

### Modify:

- 數據管理 按鈕排版
- Loading 跳 Dialog
- 作業管理停止按鈕 icon 換成實心
- 註冊頁、忘記密碼 LOGO

### Fixed:

- 漢堡ICON消失
- 新增排程、排程管理
  - 使用者操作修改功能，提交時應該為排程者，而不是管理者
  - 新增或修改時，nfsMounts or glusterfsMounts 如果是空值，不提交至後台
- 報表分析
  - 作業：日期若為自定義的最新一天時，搜尋不到正確作業
- 模板管理
  - 修改模板，編輯模板改為儲存模板
  - 新增或修改時，nfsMounts or glusterfsMounts 如果是空值，不提交至後台
- 登入頁不能切換日文

---

## 2021/01/05:

### Modify:

- SCM LOGO 更換

### Feature:

- 新增產品名稱、產品版本、公司名稱、版權年限 環境變數
- index.html串上產品名稱、產品版本

### Fix:

- Sidebar檢查權限bug icon沒顯示

---

## 2021/01/04:

### Feature:

- 升級 font-awesome
- Header 排版調整

### Modify:

- 中央處理器 -> CPU

### Fix:

- 模板管理 錯誤處理 toast 應該為 toast.error
- 翻譯修改

---

## 2020/12/31:

### Feature:

- 報表分析 增加檢查 ADMIN 權限
- 作業管理 進入作業後點選作業監控跳轉至報表分析

---

## 2020/12/30:

### Feature:

- 用戶資源使用時長

### Fix:

- 非文字檔不可編輯

---

## 2020/12/28:

### Feature:

- 用戶管理 新增顯示組別
- 數據管理 顯示/隱藏檔案

### Fix:

- 上傳文件按鈕Bug
- 模板管理
  - 檢視模板 調整欄位寬度，移除作業內重試次數
  - 搜尋欄位 應搜尋全部筆數資料並非當前筆數資料
- 左側導航欄檢查權限
- 提交作業 儲存模板 checked 失效

### Modify:

- username pattern 調整, 須為小寫英文開頭

---

## 2020/12/25:

### Feature:

- 提交作業 簡易配置
  - 任務設置 新增自定義按鈕 (按下按鈕開啟編輯JSON)
  - 任務設置 更改排版順序，依序為 CPU GPU Memory ShareMemory Storage
  - 基本設置 集群下拉式選單 新增排程集群
  - 環境配置 遠端桌面密碼型態 password

### Fix:

- 提交作業 簡易配置
  - 環境配置 遠端桌面密碼參數顯示
  - 環境配置 當無參數需要驗證，即清空錯誤訊息

---

## 2020/12/23:

### Fix:

- 提交作業模板 TaskRole Bar overflow auto
- 報表分析 記憶體單位改為 MB
- Sidebar hover 反白

### Feature:

- 提交作業新增 環境變量配置

### Modify:

- 上傳檔案樣式
- 上傳檔案改用原生 drag drop 方式
- 上傳檔案錯誤處理
