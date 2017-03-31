var res = {
 BG_mainMenu_png  : "res/mainMenu_bg.png",
 BG_battle_png  :"res/battle_bg.png",
 BG_control_png  : "res/bg_control.png",
 BG_match_png  : "res/bg_match.png",
 BG_message_png  : "res/bg_message.png",
 BG_rank_png  :"res/rank_bg.png",
 BG_tittle_png  : "res/bg_tittle.png",
 HelloWorld_png : "res/HelloWorld.png",
 BG_select_png  :"res/bg_select.png",
 BG_select0_png  :"res/bg_select0.png",
 BG_touxiang_png  :"res/bg_touxiang.png",
 BG_playerInfo_png  :"res/playerInfo_bg.png",

 btn_Emoticon_png:"res/public/btn_Emoticon.png",
 Emoticon_1_png:"res/public/Emoticon_1.png",
 Emoticon_2_png:"res/public/Emoticon_2.png",
 Emoticon_3_png:"res/public/Emoticon_3.png",
 Emoticon_BTN1_png:"res/public/btn_1.png",
 Emoticon_BTN2_png:"res/public/btn_2.png",
 Emoticon_BTN3_png:"res/public/btn_3.png",
 BLUE_BG_png:"res/public/blue_bg.png",
 LESS_BG_png:"res/public/less_bg.png",

//登录界面
 LOGIN_BG_png  :"res/login/bg_login.png",
 LOGIN_BG1_png  :"res/login/info_bg.png",
 LOGIN_BG2_png  :"res/login/blue_bg.png",
 LOGIN_SEND_BG_png  :"res/login/send_bg.png",
 LOGIN_SEND_BTN_png  :"res/login/send_btn.png",
 LOGIN_BTN_png  :"res/btn_login.png",
 BEGIN_INFO_png :"res/public/beginInfo.png",

 //道具选择
 SELECT_NO_PNG:"res/selected_no.png",
 SELECT_OK_PNG:"res/selected_ok.png",

 BTN_PROPS_png:"res/prop/btn_props.png",
 BTN_BAN_png:"res/prop/btn_ban.png",
 BTN_COVER_png:"res/prop/btn_cover.png",
 BG_BAN_png:"res/prop/bg_ban.png",
 BG_COVER_png:"res/prop/bg_cover.png",
 BG_BAR_png:"res/prop/bg_bar.png",

 BTN_BUY_ENABLE_png:"res/btnBuyEnable.png",
 BTN_BUY_DISABLE_png:"res/btnBuyDisable.png",
 BTN_SELL_ENABLE_png:"res/btnSellEnable.png",
 BTN_SELL_DISABLE_png:"res/btnSellDisable.png",


 //头像plist
 touxiang_png : "res/touxiang/touxiang.png",
 touxiang_plist : "res/touxiang/touxiang.plist"

};
var g_resources =["res/bg_tittle.png","res/battle_bg.png","res/bg_select.png","res/bg_select0.png","res/sound/home_bg.mp3","res/sound/button.mp3","res/playerInfo_bg.png","res/rank_bg.png","res/rank1.png","res/rank2.png","res/rank3.png","res/ko.png","res/vs.png","res/zhanji_bg.png","res/close.png","res/line_bg.png","res/rotate.png","res/rotate_shadow.png","res/bg_control.png","res/btn_open.png","res/btn_close.png","res/bg_message.png","res/btn_download.png","res/btn_general.png","res/btn_hd.png","res/btn_hd1.png","res/btn_general1.png","res/btnCloseBuy.png","res/btnCloseDisable.png","res/btnCloseSell.png","res/buyOpenTag.png","res/buyCloseTag.png","res/sellOpenTag.png","res/sellCloseTag.png","res/cursor.png","res/selectedBar.png","res/matchMoreEnd.png","res/matchEnd.png","res/btnEnd.png","res/meBtnReplay.png","res/meBtnAgain.png","res/btnStart.png","res/meBtnShare.png","res/btn_sc_d_normal.png","res/btn_sc_a_normal.png","res/btn_sc_d_double.png","res/btn_sc_a_double.png","res/btn_sc_d_half.png","res/btn_sc_a_half.png","res/btn_sc_play.png","res/btn_sc_bg.png","res/btn_sc_pause.png","res/mainMenu_bg.png","res/btn_control.png","res/btn_zhanji.png","res/btn_paihang.png","res/btn_help.png","res/btn_mode1_u.png","res/btn_mode1_d.png","res/btn_mode2_u.png","res/btn_mode2_d.png","res/btn_mode3_u.png","res/btn_mode3_d.png","res/btn_mode4_u.png","res/btn_mode4_d.png","res/xunzhang.png","res/btnRecord.png","res/btn_mode1d.png", "res/btn_mode1u.png","res/btn_mode2d.png", "res/btn_mode2u.png","res/btn_mode3d.png", "res/btn_mode3u.png","res/btn_mode4d.png", "res/btn_mode4u.png","res/home.png","res/select_1.png","res/select_2.png","res/select_3.png","res/select_4.png","res/select_60.png","res/select_120.png","res/select_180.png","res/select_240.png","res/select_bg.png","res/fonts/Arial.ttf","res/help/bg_help.png","res/help/bg_text.png","res/help/bg_slide.png","res/help/btn_slide.png","res/help/btn_know.png"];
for (var i in res) {
    g_resources.push(res[i]);
}
// var wsURL = 'ws://222.66.97.203:5003/';//公网测试
// var wsURL = 'ws://222.66.97.203:7003/Kgamefeng/websocket';//晓峰环境
// var wsURL = 'ws://180.169.108.231:5003/Kgamefeng/websocket';//晓峰环境
// var wsURL = 'ws://180.169.108.231:5003/';//生产环境
// var wsURL = 'ws://192.168.16.250:8484/';//测试
//  var wsURL = 'ws://192.168.16.250:8384/';//调试
//var wsURL = 'ws://192.168.16.250:5210/Kgamefeng/websocket';//晓峰环境
// var wsURL = 'ws://192.168.16.145:8080/Kgamefeng/websocket';//晓峰环境