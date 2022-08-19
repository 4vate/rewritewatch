// RewriteGadget Halfwidth Patch by osk 2020
// Translations by 4vate, oo 2021

// スピーチ
var G_speach_array = Array(
	Array(
		//Array("おはようございます。", "朝の篝ちゃんです。"),
		Array("Good morning.", "Morning Kagari-chan is here."),
		//Array("篝ちゃんもお目覚めです。", ""),
		Array("Kagari-chan woke up as well.", ""),
		//Array("決まった時間に起きねばならないとは、", "人間とは面倒な生き物ですね。"),
		Array("Having to wake up at the same time every day,", "being a human is such a pain."),
		//Array("地球はアホかった", "――――カガーリン"),
		Array("The earth is dumb", "――――Kagarin"),
		//Array("ホモ・ファベル（工作する人）よ。", "今日は建設的な一日になると良いですね。")
		Array("Homo faber (Man the Maker).", "I hope you have a productive day.")
	),
	Array(
		//Array("篝ちゃんはお散歩に行きたい気分です。", ""),
		Array("Kagari-chan feels like", "going for a walk."),
		//Array("■■■■■■■■■■■■■■", "（主観時間三ヶ月ほど説教）")
		Array("■■■■■■■■■■■■■■ (She's been", "scolding you for what feels like 3 months.)")
	),
	Array(
		//Array("篝ちゃん、ヒーコータイムに入ります。", ""),
		Array("Kagari-chan is going to", "have some coffee."),
		//Array("崩壊！", "")
		Array("Destruction!", "")
	),
	Array(
		//Array("そろそろ空に月が、", "浮かんでるのではありませんか？"),
		Array("The moon is floating in the", "sky by now, isn't it?"),
		//Array("篝ちゃん、ゴッド入ってるので", "ディナーは不要です。"),
		Array("Kagari-chan is some kinda God,", "so I don't need dinner."),
		//Array("おもしろテレビでも見るとしましょう。", ""),
		Array("I guess I'll watch some", "funny TV shows."),
		//Array("どうなっちゃっても", "篝ちゃんは知りませんからね！")
		Array("Don't say you weren't warned!", "You'll be sorry later!")
	),
	Array(
		//Array("篝ちゃんも眠るときが来たようです。", "明日起きますけど。"),
		Array("It's time for Kagari-chan to go to bed.", "I'll wake up tomorrow though."),
		//Array("いずれこの星にも、", "夜明けが訪れましょう。"),
		Array("The dawn will come to", "this planet someday."),
		//Array("篝ちゃん的には", "フィーバーなタイムです。"),
		Array("Now is an exciting", "time for Kagari-chan."),
		//Array("ホモ・ルーデンス（遊ぶ人）よ。", "夜更かしは程々がベストです。"),
		Array("Homo ludens (Man the Player).", "Try not to stay up too late."),
		//Array("たまには月などを", "眺めてみるのも良いでしょう。")
		Array("It feels nice to look", "at the moon sometimes.")
	)
);

G_speach = "";			// 現在のスピーチ
G_speach_no = -1;		// 現在のスピーチ番号
G_speach_width = 0;		// センタリング用のスピーチの長さ
G_speach_height = 0;	// センタリング用のスピーチの高さ

// 全体の位置補正
G_rep_x = 268;

// ふきだし
G_hukidashi_appear = 0;
G_hukidashi_counter = 0;
G_hukidashi_opacity = 100;
G_hukidashi_last_time = 0;
G_hukidashi_timer_id = 0;

// 時計
G_watch_last_minute = -1;

// エレメント
G_elm_hukidashi = 0;
G_elm_text = 0;
G_elm_debug = 0;

// デバッグ
G_debug_text = "";
G_test = 0;

// イベントリスナー
function add_event_listener(element, event, func)
{
	if (element)	{
		element.attachEvent(event, func);
	}
}

// HTML の読み込みが終わった
function on_load()
{
	// ビューを再構築
	restruct_view();

	// フレーム処理開始
	setInterval('on_timer()', 1000);
}

// フレーム処理
function on_timer()
{
	var cur_time_zone = System.Time.currentTimeZone;
	var time_info = System.Time.getLocalTime(cur_time_zone);
	if (time_info != "")	{
		var date_info = new Date(Date.parse(time_info));
		var minute = date_info.getMinutes();

		// 分が変わっていたら再構築
		if (minute != G_watch_last_minute)	{

			// ビューを再構築
			restruct_view();
		}
	}
}

// ビューを再構築
function restruct_view()
{
	var elm;

	if (G_hukidashi_appear == 1)	{

		// 全てのオブジェクトを解放
		background.removeObjects();

		// 吹き出しの幅を求める
		var hukidashi_width = G_speach_width;
		if (hukidashi_width < 8)	{
			hukidashi_width = 8;
		}

		G_elm_hukidashi = Array();
		elm = background.addImageObject("hukidashi_l.png", G_rep_x - 14 * hukidashi_width + 116, 0);
		elm.opacity = G_hukidashi_opacity;
		G_elm_hukidashi.push(elm);
		for (var i = 0; i < hukidashi_width - 1; i++)	{
			elm = background.addImageObject("hukidashi_c.png", G_rep_x - 14 * hukidashi_width + 128 + i * 14, 0);
			elm.opacity = G_hukidashi_opacity;
			G_elm_hukidashi.push(elm);
		}
		elm = background.addImageObject("hukidashi_r.png", G_rep_x + 114, 0);
		elm.opacity = G_hukidashi_opacity;
		G_elm_hukidashi.push(elm);

		// テキストを表示
		var speech_x = 7;
		var speach_y = 10;
		if (G_speach_height == 1)	{
			speach_y = 16;
		}
		if (G_speach_width >= 8)	{
			speech_x = -14 * G_speach_width + 126;
		}
		else	{
			speech_x = -7 * G_speach_width + 78;
		}
		elm = background.addTextObject(G_speach, "MS Gothic", 14, "Black", G_rep_x + speech_x, speach_y);
		elm.opacity = G_hukidashi_opacity;
		G_elm_hukidashi.push(elm);

		// 時計を再構築
		restruct_watch();
	}
	else	{

		// 全てのオブジェクトを解放
		background.removeObjects();

		// 時計を再構築
		restruct_watch();
	}
}

// 時計を再構築
function restruct_watch()
{
	// 時計を表示
	var cur_time_zone = System.Time.currentTimeZone;
	var time_info = System.Time.getLocalTime(cur_time_zone);
	if (time_info != "")	{
		var date_info = new Date(Date.parse(time_info));

		var year = date_info.getYear();
		var month = date_info.getMonth() + 1;
		var day = date_info.getDate();
		var wday = date_info.getDay();
		var hour = date_info.getHours();
		var minute = date_info.getMinutes();

		// 各桁を計算する
		var year_0 = Math.floor(year / 1000);
		var year_1 = Math.floor(year / 100) % 10;
		var year_2 = Math.floor(year / 10) % 10;
		var year_3 = year % 10;
		var month_0 = Math.floor(month / 10);
		var month_1 = month % 10;
		var day_0 = Math.floor(day / 10);
		var day_1 = day % 10;
		var hour_0 = Math.floor(hour / 10);
		var hour_1 = hour % 10;
		var minute_0 = Math.floor(minute / 10);
		var minute_1 = minute % 10;

		var w_1 = 7;	// '1' の長さ
		var w_9 = 9;	// '9' の長さ
		var w_1t = 5;	// 先頭の '1' の長さ

		// １行目の横幅を計算する
		var w = 0;
		if (year_0 == 1)		{	w += w_1;	}
		else					{	w += w_9;	}
		if (year_1 == 1)		{	w += w_1;	}
		else					{	w += w_9;	}
		if (year_2 == 1)		{	w += w_1;	}
		else					{	w += w_9;	}
		if (year_3 == 1)		{	w += w_1;	}
		else					{	w += w_9;	}

		w += 4;

		if (month_0 == 0)	{
			if (month_1 == 1)		{	w += w_1t;	}
			else					{	w += w_9;	}
		}
		else	{
			if (month_0 == 1)		{	w += w_1t;	}
			else					{	w += w_9;	}
			if (month_1 == 1)		{	w += w_1;	}
			else					{	w += w_9;	}
		}

		w += 4;

		if (day_0 == 0)	{
			if (day_1 == 1)			{	w += w_1t;	}
			else					{	w += w_9;	}
		}
		else	{
			if (day_0 == 1)			{	w += w_1t;	}
			else					{	w += w_9;	}
			if (day_1 == 1)			{	w += w_1;	}
			else					{	w += w_9;	}
		}

		w += 4;

		var wday_w = new Array(24, 28, 22, 27, 22, 17, 20);
		w += wday_w[wday];

		// １行目の開始位置を決定する
		var x = G_rep_x + Math.floor((120 - w) / 2 + 20);

		// １行目を構築する
		background.addImageObject("num_s" + year_0 + ".png",  x, 149);	if (year_0 == 1)	{	x += w_1;	}	else	{	x += w_9;	}
		background.addImageObject("num_s" + year_1 + ".png",  x, 149);	if (year_1 == 1)	{	x += w_1;	}	else	{	x += w_9;	}
		background.addImageObject("num_s" + year_2 + ".png",  x, 149);	if (year_2 == 1)	{	x += w_1;	}	else	{	x += w_9;	}
		background.addImageObject("num_s" + year_3 + ".png",  x, 149);	if (year_3 == 1)	{	x += w_1;	}	else	{	x += w_9;	}
		background.addImageObject("num_s_dot.png",            x, 157);	x += 4;
		if (month_0 == 0)	{
			if (month_1 == 1)	{	background.addImageObject("num_s" + month_1 + ".png", x - 2, 149);	x += w_1t;	}
			else				{	background.addImageObject("num_s" + month_1 + ".png", x, 149);		x += w_9;	}
		}
		else	{
			if (month_0 == 1)	{	background.addImageObject("num_s" + month_0 + ".png", x - 2, 149);	x += w_1t;	}
			else				{	background.addImageObject("num_s" + month_0 + ".png", x, 149);		x += w_9;	}
			if (month_1 == 1)	{	background.addImageObject("num_s" + month_1 + ".png", x, 149);		x += w_1;	}
			else				{	background.addImageObject("num_s" + month_1 + ".png", x, 149);		x += w_9;	}
		}
		background.addImageObject("num_s_dot.png",                                 x, 157);		x += 4;
		if (day_0 == 0)	{
			if (day_1 == 1)		{	background.addImageObject("num_s" + day_1 + ".png", x - 2, 149);	x += w_1t;	}
			else				{	background.addImageObject("num_s" + day_1 + ".png", x, 149);		x += w_9;	}
		}
		else	{
			if (day_0 == 1)		{	background.addImageObject("num_s" + day_0 + ".png", x - 2, 149);	x += w_1t;	}
			else				{	background.addImageObject("num_s" + day_0 + ".png", x, 149);		x += w_9;	}
			if (day_1 == 1)		{	background.addImageObject("num_s" + day_1 + ".png", x, 149);		x += w_1;	}
			else				{	background.addImageObject("num_s" + day_1 + ".png", x, 149);		x += w_9;	}
		}
		background.addImageObject("num_s_dot.png",                                 x, 157);		x += 4;
		switch (wday)	{
			case 0:		background.addImageObject("wd_sun.png", x, 149);	break;
			case 1:		background.addImageObject("wd_mon.png", x, 149);	break;
			case 2:		background.addImageObject("wd_tue.png", x, 149);	break;
			case 3:		background.addImageObject("wd_wed.png", x, 149);	break;
			case 4:		background.addImageObject("wd_thu.png", x, 149);	break;
			case 5:		background.addImageObject("wd_fri.png", x, 149);	break;
			case 6:		background.addImageObject("wd_sat.png", x, 149);	break;
		}

		background.addImageObject("num_l" + hour_0 + ".png",        G_rep_x + 35, 162);
		background.addImageObject("num_l" + hour_1 + ".png",        G_rep_x + 56, 162);
		background.addImageObject("num_l_colon.png",                G_rep_x + 77, 166);
		background.addImageObject("num_l" + minute_0 + ".png",      G_rep_x + 84, 162);
		background.addImageObject("num_l" + minute_1 + ".png",      G_rep_x + 105, 162);

	}

	// 情報を更新
	G_watch_last_minute = minute;
}

// クリックした
function on_click()
{
	// 時間を求める
	var now = new Date();
	var hour = now.getHours();

	// スピーチを選ぶ
	var si = 0, sj = 0;
	if (0 <= hour && hour < 6)	{
		si = 4;		// 深夜
	}
	else if (6 <= hour && hour < 12)	{
		si = 0;		// 朝
	}
	else if (12 <= hour && hour < 15)	{
		si = 1;		// 昼
	}
	else if (15 <= hour && hour < 18)	{
		si = 2;		// 夕
	}
	else if (18 <= hour && hour < 24)	{
		si = 3;		// 夜
	}

	var speach_cnt = G_speach_array[si].length;
	if (speach_cnt >= 2)	{
		while (1)	{
			sj = Math.floor(Math.random() * speach_cnt);
			if (G_speach_no == -1 || sj != G_speach_no)	{
				G_speach_no = sj;
				break;
			}
		}
	}
	else	{
		sj = 0;
		G_speach_no = sj;
	}

	// スピーチを構成して高さを求める
	var len1 = G_speach_array[si][sj][0].length;
	var len2 = G_speach_array[si][sj][1].length;
	if (len2 == 0)	{
		G_speach = G_speach_array[si][sj][0];
		G_speach_height = 1;
	}
	else	{
		G_speach = G_speach_array[si][sj][0] + "\n" + G_speach_array[si][sj][1];
		G_speach_height = 2;
	}

	// １行目と２行目、長い方を幅とする
	G_speach_width = 0;
	if (len1 > len2)	{
		G_speach_width = len1;
	}
	else	{
		G_speach_width = len2;
	}
	G_speach_width = Math.ceil(G_speach_width / 2);

	// 次のスピーチへ
	//G_speach_no = (G_speach_no + 1) % G_speach_cnt;

	// 吹き出し開始
	G_hukidashi_appear = 1;
	G_hukidashi_counter = 0;
	G_hukidashi_opacity = 0;

	// ビューを再構築
	restruct_view();

	// 吹き出しのタイマー初期化
	G_hukidashi_last_time = +new Date();

	// 吹き出し用のタイマー設定
	clearInterval(G_hukidashi_timer_id);
	G_hukidashi_timer_id = setInterval('on_timer_hukidashi()', 1);

	return true;
}

// 吹き出し終了
function finish_hukidashi()
{
	G_hukidashi_appear = 0;
	G_hukidashi_opacity = 0;

	// 吹き出し用のタイマー終了
	clearInterval(G_hukidashi_timer_id);
}

// 吹き出し用のタイマー処理
function on_timer_hukidashi()
{
	var cur_time = +new Date();
	var past_time = cur_time - G_hukidashi_last_time;

	// 吹き出しの計算
	if (G_hukidashi_appear == 1)	{
		G_hukidashi_counter += past_time;

		if (G_hukidashi_counter >= 5000)	{

			// 吹き出し終了
			finish_hukidashi();
		}
		else if (G_hukidashi_counter >= 4500)	{
			G_hukidashi_opacity = linear_limit(G_hukidashi_counter, 4500, 100, 5000, 0);
		}
		//else if (G_hukidashi_counter <= 500)	{
		//	G_hukidashi_opacity = linear_limit(G_hukidashi_counter, 0, 0, 500, 100);
		//}
		else	{
			G_hukidashi_opacity = 100;
		}
	}

	// 吹き出しの透明度を再構築
	restruct_hukidashi_opacity();

	// タイマーを更新
	G_hukidashi_last_time = cur_time;
}

// 吹き出しの透明度を再構築
function restruct_hukidashi_opacity()
{
	if (G_elm_hukidashi)	{
		var len = G_elm_hukidashi.length;
		for (var i = 0; i < len; i++)	{
			G_elm_hukidashi[i].opacity = G_hukidashi_opacity;
		}
	}
}


// 線形補完
function linear_limit(now, t1, v1, t2, v2)
{
	if (t1 == t2)	{
		return 0;
	}

	var time_len = t2 - t1;
	if (now < t1)	{
		return v1;
	}
	else if (now >= t2)	{
		return v2;
	}
	else	{
		return (v2 - v1) * (now - t1) / (t2 - t1) + v1;
	}
}
