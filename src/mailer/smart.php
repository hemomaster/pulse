<?php 

$opt_array = array();
foreach ( $_POST as $key => $value ) {
  $opt_array[$key]=$value;
}

// $name = $_POST['name'];
// $phone = $_POST['phone'];
// $email = $_POST['email'];

require_once('phpmailer/PHPMailerAutoload.php');
$mail = new PHPMailer;
$mail->CharSet = 'utf-8';

// $mail->SMTPDebug = 3;                               // Enable verbose debug output

$mail->isSMTP();                                      // Set mailer to use SMTP
$mail->Host = 'smtp.ukr.net';  // Specify main and backup SMTP servers
$mail->SMTPAuth = true;                               // Enable SMTP authentication
$mail->Username = $opt_array['admin_email'];                 // Наш логин
$mail->Password = 'gQyEUIEgjGjUXEsQ';                           // Наш пароль от ящика
$mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
$mail->Port = 465;                                    // TCP port to connect to

$mail->setFrom($opt_array['admin_email'], 'Pulse');   // От кого письмо 
$mail->addAddress($opt_array['user_email']);     // Add a recipient
//$mail->addAddress('ellen@example.com');               // Name is optional
//$mail->addReplyTo('info@example.com', 'Information');
//$mail->addCC('cc@example.com');
//$mail->addBCC('bcc@example.com');
//$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
//$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
$mail->isHTML(true);                                  // Set email format to HTML

$mail->Subject = $opt_array['form_subject'];
$mail->Body    = '
		Пользователь оставил данные <br> 
	Имя: ' . $opt_array['user_name'] . ' <br>
	Номер телефона: ' . $opt_array['user_phone'] . '<br>
	E-mail: ' . $opt_array['user_email'] . '';



if(!$mail->send()) {
    return false;
} else {
		header('Content-type: application/json');
		echo json_encode($opt_array);
    return true;
}

?>