import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CharacterCounter from '../components/CharacterCounter';
import { UserProfile } from '../types';

const ProfileScreen: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile>({
        name: 'Rashmi Desai',
        gender: 'Female',
        location: 'Greater noida',
        profession: 'Teacher',
        bio: 'Once you have everything set on your bio, you can use this tailin Instagram Schedule',
    });

    const [isEditing, setIsEditing] = useState(false);
    const MAX_BIO_WORDS = 120;

    const handleUpdate = () => {
        const wordCount = profile.bio.trim() === '' ? 0 : profile.bio.trim().split(/\s+/).length;

        if (wordCount > MAX_BIO_WORDS) {
            Alert.alert(
                'Error',
                `Bio cannot exceed ${MAX_BIO_WORDS} words. Current: ${wordCount} words`
            );
            return;
        }

        Alert.alert('Success', 'Profile updated successfully!', [
            { text: 'OK', onPress: () => setIsEditing(false) }
        ]);
    };

    const InputField = ({
        label,
        value,
        onChangeText,
        placeholder,
        multiline = false
    }: any) => (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={[styles.input, multiline && styles.textArea]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#999"
                editable={isEditing}
                multiline={multiline}
                numberOfLines={multiline ? 4 : 1}
            />
        </View>
    );

    const GenderSelector = () => (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderContainer}>
                {['Female', 'Male', 'Other'].map((option) => (
                    <TouchableOpacity
                        key={option}
                        style={[
                            styles.genderOption,
                            profile.gender === option && styles.genderOptionSelected,
                            !isEditing && styles.genderOptionDisabled,
                        ]}
                        onPress={() => isEditing && setProfile({ ...profile, gender: option })}
                        disabled={!isEditing}
                    >
                        <Text
                            style={[
                                styles.genderText,
                                profile.gender === option && styles.genderTextSelected,
                            ]}
                        >
                            {option}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#143444" />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>Update Account</Text>
                    {!isEditing && (
                        <TouchableOpacity onPress={() => setIsEditing(true)}>
                            <Icon name="edit" size={24} color="#fff" />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.avatarSection}>
                    <View style={styles.avatar}>
                        <Icon name="person" size={50} color="#fff" />
                    </View>
                    {isEditing && (
                        <TouchableOpacity style={styles.changePhotoBtn}>
                            <Text style={styles.changePhotoText}>Change Photo</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.form}>
                    <InputField
                        label="Name"
                        value={profile.name}
                        onChangeText={(text: string) => setProfile({ ...profile, name: text })}
                        placeholder="Enter your name"
                    />

                    <GenderSelector />

                    <InputField
                        label="Location"
                        value={profile.location}
                        onChangeText={(text: string) => setProfile({ ...profile, location: text })}
                        placeholder="Enter your location"
                    />

                    <InputField
                        label="Profession"
                        value={profile.profession}
                        onChangeText={(text: string) => setProfile({ ...profile, profession: text })}
                        placeholder="Enter your profession"
                    />

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Bio</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={profile.bio}
                            onChangeText={(text: string) => setProfile({ ...profile, bio: text })}
                            placeholder="Tell us about yourself (max 120 words)"
                            placeholderTextColor="#999"
                            editable={isEditing}
                            multiline
                            numberOfLines={4}
                        />
                        <CharacterCounter text={profile.bio} maxWords={MAX_BIO_WORDS} />
                    </View>

                    <View style={styles.buttonContainer}>
                        {isEditing ? (
                            <>
                                <TouchableOpacity
                                    style={[styles.button, styles.cancelButton]}
                                    onPress={() => {
                                        setIsEditing(false);
                                    }}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.updateButton]}
                                    onPress={handleUpdate}
                                >
                                    <Text style={styles.updateButtonText}>Save Changes</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <TouchableOpacity
                                style={[styles.button, styles.updateButton]}
                                onPress={handleUpdate}
                            >
                                <Text style={styles.updateButtonText}>Update Account</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#143444'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    avatarSection: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#143444',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    changePhotoBtn: {
        paddingVertical: 8,
    },
    changePhotoText: {
        color: '#143444',
        fontSize: 14,
    },
    form: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        color: '#000',
        backgroundColor: '#f9f9f9',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    genderContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    genderOption: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
    },
    genderOptionSelected: {
        backgroundColor: '#143444',
        borderColor: '#143444',
    },
    genderOptionDisabled: {
    },
    genderText: {
        fontSize: 14,
        color: '#333',
    },
    genderTextSelected: {
        color: '#fff',
        fontWeight: '600',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    updateButton: {
        backgroundColor: '#143444',
    },
    updateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButton: {
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
    },
});

export default ProfileScreen;