import React from 'react';
import styles from './AboutUs.module.css'; // Импорт стилей для страницы
import Header from '../Header/Header';

const AboutUs = () => {
    return (
        <div className={styles.pageContainer}>
            <Header />
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1>Про нас</h1>
                    <p>Ми допомагаємо людям знайти ідеальне житло по всій Європі та Україні.</p>
                </header>

                <section className={styles.mission}>
                    <h2>Наша місія</h2>
                    <p>
                        Наша місія полягає в тому, щоб зробити процес пошуку житла максимально зручним, швидким та приємним. Ми пропонуємо інтуїтивно зрозумілий інтерфейс, швидкий пошук і різноманітні фільтри, які допоможуть знайти ідеальний варіант житла для кожного користувача. Платформа забезпечує прозорість, безпеку та можливість прямого зв'язку з власниками житла.
                    </p>
                </section>

                <section className={styles.team}>
                    <h2>Про автора</h2>
                    <p>
                        Цей проект був створений студентом 4-го курсу, Шеліховим Дмитром, з метою розробки нового рівня сервісу для пошуку житла. Я прагну створити платформу, яка дозволить людям швидко і зручно знаходити житло в будь-якій країні Європи чи в Україні.
                    </p>
                </section>

                <section className={styles.contact}>
                    <h2>Зв'язатися з нами</h2>
                    <p>
                        Якщо у вас є питання або вам потрібна підтримка, будь ласка, зв'яжіться з нами:
                    </p>
                    <p>
                        <strong>Email:</strong> dimaschelichov228@gmail.com<br />
                        <strong>Телефон:</strong> +380 99 75 28 538<br />
                    </p>
                </section>
            </div>
            
        </div>
    );
};

export default AboutUs;