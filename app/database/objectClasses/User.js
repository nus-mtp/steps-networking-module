class User{
    constructor(Name, Email, Description, Hashed_PW, isNotified, isDeleted) {
        this.Name = Name;
        this.Email = Email;
        this.Description = Description;
        this.Hashed_PW = Hashed_PW;
        this.isNotfied = isNotified;
        this.isDeleted = isDeleted;
    }
    getName(){
        return this.Name;
    }
    
    getEmail(){
        return this.Email;
    }
    
    getDescription(){
        return this.Description;
    }
    
    getHashedPW(){
        return this.Hashed_PW;
    }
    
    getIsNotified(){
        return this.isNotfied;
    }
    
    getIsDeleted(){
        return this.isDeleted;
    }
    
    setName(newName){
        this.Name = newName;
    }
    
    setEmail(newEmail){
        this.Email = newEmail;
    }
    
    setDescription(newDescription){
        this.Description = newDescription;
    }
    
    setHashedPW(newHashedPW){
        this.Hashed_PW = newHashedPW;
    }
    
    setIsNotified(newIsNotified){
        this.isNotfied = newIsNotified;
    }
    
    setIsDeleted(newIsDeleted){
        this.isDeleted = newIsDeleted;
    }
    
}