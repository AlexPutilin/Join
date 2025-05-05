function getSignupFormTemplate() {
    return /*html*/`
            <section class="form-wrapper">
            <form action="submit">
                <h1>Sign up</h1>

                <!-- <input type="text" placeholder="Name" required> -->
                <div class="input-wrapper">
                    <div class="input-area">
                        <input type="text" placeholder="Name" required>
                        <img src="./assets/img/icon-person.svg" alt="">
                    </div>
                </div>

                <!-- <input type="email" placeholder="Email" required> -->
                <div class="input-wrapper">
                    <div class="input-area">
                        <input type="email" placeholder="Email" required>
                        <img src="./assets/img/icon-mail.svg" alt="">
                    </div>
                </div>

                <!-- <input type="password" placeholder="Password" required> -->
                <div class="input-wrapper">
                    <div class="input-area">
                        <input type="password" placeholder="Password" required>
                        <img src="./assets/img/icon-lock.svg" alt="">
                    </div>
                </div>

                <!-- <input type="password" placeholder="Password" required> -->
                <div class="input-wrapper">
                    <div class="input-area">
                        <input type="password" placeholder="Confirm Password" required>
                        <img src="./assets/img/icon-lock.svg" alt="">
                    </div>
                </div>

                <div class="checkbox-wrapper">
                    <label>
                        <input type="checkbox">
                        <span>I accept the <a>Privacy policy</a></span>
                    </label>
                </div>
                
                <div>
                    <button class="btn-dark">Sign up</button>
                </div>
            </form>
        </section>
   `;
}